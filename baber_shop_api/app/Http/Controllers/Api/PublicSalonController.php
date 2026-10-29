<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\JsonResponse;

class PublicSalonController extends Controller
{
    public function index(): JsonResponse
    {
        $salons = Salon::query()
            ->where('is_active', true)
            ->select([
                'id',
                'name',
                'slug',
                'phone',
                'address',
                'city',
                'logo',
            ])
            ->orderBy('name')
            ->paginate(12);

        return response()->json($salons);
    }

    public function show(string $slug): JsonResponse
    {
        $salon = Salon::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $queue = $salon->queues()
            ->whereDate('queue_date', now()->toDateString())
            ->first();

        $services = $salon->services()
            ->where('is_active', true)
            ->select([
                'id',
                'salon_id',
                'name',
                'description',
                'duration_minutes',
                'price',
            ])
            ->orderBy('name')
            ->get();

        return response()->json([
            'salon' => [
                'id' => $salon->id,
                'name' => $salon->name,
                'slug' => $salon->slug,
                'phone' => $salon->phone,
                'address' => $salon->address,
                'city' => $salon->city,
                'logo' => $salon->logo,
            ],
            'services' => $services,
            'queue' => $queue ? [
                'status' => $queue->status,
                'queue_date' => $queue->queue_date->toDateString(),
                'waiting_count' => $queue->entries()
                    ->whereIn('status', ['waiting', 'serving'])
                    ->count(),
            ] : [
                'status' => 'not_started',
                'waiting_count' => 0,
            ],
        ]);
    }
}
