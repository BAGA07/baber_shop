<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;

class SalonServiceController extends Controller
{
    /**
     * Lister les prestations du salon du gérant connecté.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->salon_id || ! $user->salon || ! $user->salon->is_active) {
            return response()->json([
                'message' => 'Votre salon est indisponible.',
            ], 403);
        }

        $services = Service::query()
            ->where('salon_id', $user->salon_id)
            ->with('template:id,name,slug')
            ->orderBy('name')
            ->get();

        return response()->json([
            'services' => $services,
        ]);
    }

    /**
     * Ajouter une prestation à partir du catalogue commun.
     * Le prix et la durée peuvent être personnalisés par le salon.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->salon_id || ! $user->salon || ! $user->salon->is_active) {
            return response()->json([
                'message' => 'Votre salon est indisponible.',
            ], 403);
        }

        $validated = $request->validate([
            'template_id' => [
                'required',
                'integer',
                Rule::exists('service_templates', 'id')
                    ->where('is_active', true),
            ],
            'price' => ['sometimes', 'integer', 'min:0', 'max:100000000'],
            'duration_minutes' => ['sometimes', 'integer', 'min:1', 'max:600'],
        ]);

        $template = ServiceTemplate::query()
            ->where('is_active', true)
            ->findOrFail($validated['template_id']);

        try {
            $service = DB::transaction(function () use ($user, $template, $validated) {
                // Une prestation du même nom peut déjà exister,
                // y compris si elle a été supprimée logiquement.
                $service = Service::withTrashed()
                    ->where('salon_id', $user->salon_id)
                    ->where('name', $template->name)
                    ->first();

                if ($service && ! $service->trashed()) {
                    abort(response()->json([
                        'message' => 'Cette prestation existe déjà dans votre salon.',
                    ], 409));
                }

                if (! $service) {
                    $service = new Service();
                    $service->salon_id = $user->salon_id;
                } else {
                    $service->restore();
                }

                $service->service_template_id = $template->id;
                $service->name = $template->name;
                $service->description = $template->description;
                $service->image_path = $template->image_path;
                $service->duration_minutes = $validated['duration_minutes']
                    ?? $template->default_duration_minutes;
                $service->price = $validated['price']
                    ?? $template->suggested_price;
                $service->is_active = true;
                $service->save();

                return $service;
            });
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23000') {
                return response()->json([
                    'message' => 'Cette prestation existe déjà dans votre salon.',
                ], 409);
            }

            throw $exception;
        }

        return response()->json([
            'message' => 'Prestation ajoutée au salon.',
            'service' => $service->load('template:id,name,slug'),
        ], 201);
    }

    /**
     * Modifier une prestation appartenant au salon connecté.
     */
    public function update(Request $request, int $serviceId): JsonResponse
    {
        $user = $request->user();

        if (! $user->salon_id || ! $user->salon || ! $user->salon->is_active) {
            return response()->json([
                'message' => 'Votre salon est indisponible.',
            ], 403);
        }

        $service = Service::query()
            ->where('salon_id', $user->salon_id)
            ->findOrFail($serviceId);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('services', 'name')
                    ->where('salon_id', $user->salon_id)
                    ->ignore($service->id),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'price' => ['sometimes', 'integer', 'min:0', 'max:100000000'],
            'duration_minutes' => ['sometimes', 'integer', 'min:1', 'max:600'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $service->fill($validated);
        $service->save();

        return response()->json([
            'message' => 'Prestation mise à jour.',
            'service' => $service->fresh()->load('template:id,name,slug'),
        ]);
    }
}
