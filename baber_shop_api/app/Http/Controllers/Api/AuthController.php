<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Salon;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Inscription d'un salon et de son gérant.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $result = DB::transaction(function () use ($data) {
            $baseSlug = Str::slug($data['salon_name']);

            if ($baseSlug === '') {
                $baseSlug = 'salon';
            }

            $slug = $baseSlug;
            $suffix = 1;

            while (Salon::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $suffix;
                $suffix++;
            }

            $salon = Salon::create([
                'name' => $data['salon_name'],
                'slug' => $slug,
                'phone' => $data['salon_phone'] ?? null,
                'email' => $data['salon_email'] ?? null,
                'address' => $data['salon_address'] ?? null,
                'city' => $data['salon_city'] ?? 'Bamako',
                'is_active' => true,
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'salon_id' => $salon->id,
                'role' => 'gerant',
            ]);

            return [
                'salon' => $salon,
                'user' => $user,
            ];
        });

        $token = $result['user']
            ->createToken('barber-shop-app')
            ->plainTextToken;

        return response()->json([
            'message' => 'Salon créé avec succès.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $result['user'],
            'salon' => $result['salon'],
        ], 201);
    }

    /**
     * Connexion.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Adresse e-mail ou mot de passe incorrect.',
            ], 401);
        }

        if (! $user->salon || ! $user->salon->is_active) {
            return response()->json([
                'message' => 'Ce salon est désactivé ou indisponible.',
            ], 403);
        }

        $token = $user->createToken('barber-shop-app')
            ->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'salon' => $user->salon,
        ]);
    }

    /**
     * Informations de l'utilisateur connecté.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('salon');

        return response()->json([
            'user' => $user,
            'salon' => $user->salon,
        ]);
    }

    /**
     * Déconnexion : révocation du jeton courant.
     */
    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }
}
