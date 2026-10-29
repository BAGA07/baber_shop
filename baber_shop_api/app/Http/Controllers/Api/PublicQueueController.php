<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Models\QueueEntry;
use App\Models\Salon;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PublicQueueController extends Controller
{
    public function join(Request $request, string $slug): JsonResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'integer'],
            'client_name' => ['required', 'string', 'max:255'],
            'client_phone' => ['required', 'string', 'max:30'],
        ]);

        $salon = Salon::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $service = Service::query()
            ->where('salon_id', $salon->id)
            ->where('id', $data['service_id'])
            ->where('is_active', true)
            ->first();

        if (! $service) {
            throw ValidationException::withMessages([
                'service_id' => [
                    'Cette prestation est indisponible dans ce salon.',
                ],
            ]);
        }

        $trackingToken = Str::random(64);

        $entry = DB::transaction(function () use (
            $salon,
            $service,
            $data,
            $trackingToken
        ) {
            $today = now()->toDateString();

            $queue = Queue::firstOrCreate(
                [
                    'salon_id' => $salon->id,
                    'queue_date' => $today,
                    'name' => 'File principale',
                ],
                ['status' => 'open']
            );

            $queue = Queue::whereKey($queue->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($queue->status !== 'open') {
                abort(409, 'La file de ce salon est fermée ou en pause.');
            }

            $lastPosition = $queue->entries()
                ->whereIn('status', ['waiting', 'serving'])
                ->max('position') ?? 0;

            return QueueEntry::create([
                'queue_id' => $queue->id,
                'salon_id' => $salon->id,
                'service_id' => $service->id,
                'client_name' => trim($data['client_name']),
                'client_phone' => trim($data['client_phone']),
                'position' => $lastPosition + 1,
                'status' => 'waiting',
                'duration_minutes' => $service->duration_minutes,
                'price' => $service->price,
                'joined_at' => now(),
                'tracking_token_hash' => hash(
                    'sha256',
                    $trackingToken
                ),
            ]);
        });

        return response()->json([
            'message' => 'Tu as rejoint la file avec succès.',
            'tracking_token' => $trackingToken,
            'entry' => [
                'position' => $entry->position,
                'status' => $entry->status,
                'client_name' => $entry->client_name,
                'service' => $service->name,
                'price' => $entry->price,
                'duration_minutes' => $entry->duration_minutes,
                'joined_at' => $entry->joined_at,
            ],
        ], 201);
    }

    public function status(string $token): JsonResponse
    {
        if (! preg_match('/^[a-zA-Z0-9]{64}$/', $token)) {
            abort(404);
        }

        $entry = QueueEntry::query()
            ->where(
                'tracking_token_hash',
                hash('sha256', $token)
            )
            ->with(['salon:id,name,slug', 'service:id,name'])
            ->firstOrFail();

        $aheadCount = QueueEntry::query()
            ->where('queue_id', $entry->queue_id)
            ->where('position', '<', $entry->position)
            ->whereIn('status', ['waiting', 'serving'])
            ->count();

        return response()->json([
            'salon' => $entry->salon->name,
            'service' => $entry->service->name,
            'position' => $entry->position,
            'people_ahead' => $aheadCount,
            'status' => $entry->status,
            'price' => $entry->price,
            'duration_minutes' => $entry->duration_minutes,
            'joined_at' => $entry->joined_at,
            'started_at' => $entry->started_at,
            'completed_at' => $entry->completed_at,
        ]);
    }
}
