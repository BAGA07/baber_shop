<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name)
                ? trim($this->name)
                : $this->name,

            'salon_name' => is_string($this->salon_name)
                ? trim($this->salon_name)
                : $this->salon_name,

            'email' => is_string($this->email)
                ? Str::lower(trim($this->email))
                : $this->email,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'salon_name' => ['required', 'string', 'max:255'],
            'salon_phone' => ['nullable', 'string', 'max:30'],
            'salon_email' => ['nullable', 'email', 'max:255'],
            'salon_address' => ['nullable', 'string', 'max:255'],
            'salon_city' => ['nullable', 'string', 'max:100'],
        ];
    }
}
