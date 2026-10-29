<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicQueueController;
use App\Http\Controllers\Api\PublicSalonController;
use App\Http\Controllers\Api\PublicServiceCatalogController;
use App\Http\Controllers\Api\SalonServiceController;
use Illuminate\Support\Facades\Route;

// Espace gérant : routes existantes
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Gestion des prestations du salon connecté
    Route::get('/salon/services', [SalonServiceController::class, 'index']);
    Route::post('/salon/services', [SalonServiceController::class, 'store']);
    Route::patch('/salon/services/{serviceId}', [SalonServiceController::class, 'update']);
});

// Espace public : accès sans compte
Route::prefix('public')->group(function () {
    Route::get('/salons', [PublicSalonController::class, 'index']);
    Route::get('/salons/{slug}', [PublicSalonController::class, 'show']);

    Route::post(
        '/salons/{slug}/queue',
        [PublicQueueController::class, 'join']
    )->middleware('throttle:10,1');

    Route::get(
        '/queue/{token}',
        [PublicQueueController::class, 'status']
    )->middleware('throttle:60,1');

    Route::get(
        '/service-categories',
        [PublicServiceCatalogController::class, 'categories']
    );

    Route::get(
        '/service-templates',
        [PublicServiceCatalogController::class, 'templates']
    );
});
