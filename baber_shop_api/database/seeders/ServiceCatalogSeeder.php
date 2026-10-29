<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use App\Models\ServiceTemplate;
use Illuminate\Database\Seeder;

class ServiceCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalogue = [
            [
                'name' => 'Coupe de cheveux',
                'slug' => 'coupe-cheveux',
                'description' => 'Coupes classiques et modernes.',
                'sort_order' => 1,
                'services' => [
                    [
                        'name' => 'Coupe classique',
                        'slug' => 'coupe-classique',
                        'description' => 'Coupe de cheveux classique.',
                        'duration' => 30,
                        'price' => 2000,
                        'image' => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Dégradé',
                        'slug' => 'degrade',
                        'description' => 'Dégradé progressif aux finitions soignées.',
                        'duration' => 40,
                        'price' => 3000,
                        'image' => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Coupe enfant',
                        'slug' => 'coupe-enfant',
                        'description' => 'Coupe adaptée aux enfants.',
                        'duration' => 25,
                        'price' => 1500,
                        'image' => 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Contours',
                        'slug' => 'contours',
                        'description' => 'Retouche des contours et finitions.',
                        'duration' => 15,
                        'price' => 1000,
                        'image' => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Barbe et rasage',
                'slug' => 'barbe-rasage',
                'description' => 'Entretien et mise en forme de la barbe.',
                'sort_order' => 2,
                'services' => [
                    [
                        'name' => 'Taille de barbe',
                        'slug' => 'taille-barbe',
                        'description' => 'Taille et mise en forme de la barbe.',
                        'duration' => 20,
                        'price' => 1500,
                        'image' => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Rasage complet',
                        'slug' => 'rasage-complet',
                        'description' => 'Rasage complet du visage.',
                        'duration' => 25,
                        'price' => 2000,
                        'image' => 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Soins capillaires',
                'slug' => 'soins-capillaires',
                'description' => 'Soins et entretien des cheveux.',
                'sort_order' => 3,
                'services' => [
                    [
                        'name' => 'Shampoing',
                        'slug' => 'shampoing',
                        'description' => 'Lavage et nettoyage des cheveux.',
                        'duration' => 15,
                        'price' => 1000,
                        'image' => 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Soin capillaire',
                        'slug' => 'soin-capillaire',
                        'description' => 'Soin nourrissant pour les cheveux.',
                        'duration' => 30,
                        'price' => 2500,
                        'image' => 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Tresses et coiffure',
                'slug' => 'tresses-coiffure',
                'description' => 'Tresses et coiffures variées.',
                'sort_order' => 4,
                'services' => [
                    [
                        'name' => 'Tresses simples',
                        'slug' => 'tresses-simples',
                        'description' => 'Réalisation de tresses simples.',
                        'duration' => 60,
                        'price' => 5000,
                        'image' => 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
                    ],
                    [
                        'name' => 'Coiffure personnalisée',
                        'slug' => 'coiffure-personnalisee',
                        'description' => 'Coiffure adaptée aux souhaits du client.',
                        'duration' => 60,
                        'price' => 5000,
                        'image' => 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
                    ],
                ],
            ],
        ];

        foreach ($catalogue as $categorieData) {
            $categorie = ServiceCategory::updateOrCreate(
                ['slug' => $categorieData['slug']],
                [
                    'name' => $categorieData['name'],
                    'description' => $categorieData['description'],
                    'is_active' => true,
                    'sort_order' => $categorieData['sort_order'],
                ]
            );

            foreach ($categorieData['services'] as $serviceData) {
                ServiceTemplate::updateOrCreate(
                    ['slug' => $serviceData['slug']],
                    [
                        'service_category_id' => $categorie->id,
                        'name' => $serviceData['name'],
                        'description' => $serviceData['description'],
                        'image_path' => $serviceData['image'],
                        'default_duration_minutes' => $serviceData['duration'],
                        'suggested_price' => $serviceData['price'],
                        'is_active' => true,
                        'sort_order' => 0,
                    ]
                );
            }
        }
    }
}
