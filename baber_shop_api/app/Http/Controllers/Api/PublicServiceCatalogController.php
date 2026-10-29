<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\ServiceTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicServiceCatalogController extends Controller
{
    /**
     * Afficher les catégories actives avec leurs prestations modèles.
     */
    public function categories(): JsonResponse
    {
        $categories = ServiceCategory::query()
            ->where('is_active', true)
            ->with([
                'templates' => function ($query) {
                    $query->where('is_active', true)
                        ->orderBy('sort_order')
                        ->orderBy('name');
                },
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * Afficher les prestations modèles, avec filtrage facultatif par catégorie.
     */
    public function templates(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'integer', 'exists:service_categories,id'],
        ]);

        $templates = ServiceTemplate::query()
            ->where('is_active', true)
            ->with('category:id,name,slug')
            ->when(
                isset($validated['category_id']),
                fn($query) => $query->where(
                    'service_category_id',
                    $validated['category_id']
                )
            )
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'services' => $templates,
        ]);
    }
}
