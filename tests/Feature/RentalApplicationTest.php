<?php

namespace Tests\Feature;

use App\Mail\FormSubmittedNotification;
use App\Models\Apartment;
use App\Models\RentalApplication;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RentalApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_rental_application_can_be_submitted_without_recaptcha_in_local(): void
    {
        Mail::fake();
        Http::fake();

        Setting::updateOrCreate(
            ['key' => 'rental_email'],
            ['value' => 'rentals@example.com', 'label' => 'Rental Email']
        );

        $apartment = Apartment::create([
            'title' => 'Unit 101',
            'description' => 'Nice apartment',
            'location' => 'Sydney',
            'price' => 1200,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'images' => [],
            'status' => 'available',
            'has_parking' => true,
        ]);

        $response = $this->post(route('forms.rental.store'), $this->validPayload($apartment));

        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('success');

        $application = RentalApplication::first();

        $this->assertNotNull($application);
        $this->assertEquals($apartment->id, $application->apartment_id);
        $this->assertTrue((bool) $application->application_data['terms_agreed']);
        $this->assertCount(3, $application->files);

        Mail::assertSent(FormSubmittedNotification::class);
    }

    public function test_rental_application_requires_conditional_fields(): void
    {
        Mail::fake();

        $apartment = Apartment::create([
            'title' => 'Unit 102',
            'description' => 'Nice apartment',
            'location' => 'Sydney',
            'price' => 1400,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'images' => [],
            'status' => 'available',
            'has_parking' => false,
        ]);

        $payload = $this->validPayload($apartment);
        unset($payload['pet_photo']);
        $payload['application_data']['viewing_availability'] = '';
        $payload['application_data']['current_income_source'] = '';

        $response = $this->post(route('forms.rental.store'), $payload);

        $response->assertSessionHasErrors([
            'pet_photo',
            'application_data.viewing_availability',
            'application_data.current_income_source',
        ]);
    }

    public function test_rental_application_can_be_submitted_with_rental_and_employment_history(): void
    {
        Mail::fake();
        Http::fake();

        Setting::updateOrCreate(
            ['key' => 'rental_email'],
            ['value' => 'rentals@example.com', 'label' => 'Rental Email']
        );

        $apartment = Apartment::create([
            'title' => 'Unit 201',
            'description' => 'Large apartment',
            'location' => 'Sydney',
            'price' => 1800,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'images' => [],
            'status' => 'available',
            'has_parking' => true,
        ]);

        $payload = $this->validPayload($apartment, [
            'application_data' => [
                'pets' => 'No',
                'pets_count' => '',
                'viewed_property' => 'Yes',
                'viewing_availability' => '',
                'rented_before' => 'Yes',
                'current_rental_address' => '456 Queen St',
                'manager_name' => 'Mary Manager',
                'manager_contact' => '555-888-9999',
                'rental_length' => '2 years',
                'reason_for_moving' => 'Need more space',
                'previous_rental_address' => '12 River Rd',
                'previous_manager_name' => 'James Owner',
                'previous_manager_contact' => '555-121-2323',
                'previous_rental_length' => '1 year',
                'vehicles' => 'Yes',
                'employed' => 'Yes',
                'employer_name' => 'Cape Breton College',
                'income' => '$4,500 / month',
                'supervisor_name' => 'Sarah Lead',
                'supervisor_contact' => '555-444-7777',
                'current_income_source' => '',
                'co_applicants' => [
                    [
                        'name' => 'Alex',
                        'last_name' => 'Stone',
                        'email' => 'alex@example.com',
                        'address' => '456 Queen St',
                        'date_of_birth' => '1994-07-15',
                        'employed' => 'Yes',
                        'employer_name' => 'Harbour Services',
                        'income' => '$3,900 / month',
                        'supervisor_name' => 'Nina Boss',
                        'supervisor_contact' => '555-100-2000',
                        'current_income_source' => '',
                    ],
                ],
            ],
        ]);
        unset($payload['pet_photo']);

        $response = $this->post(route('forms.rental.store'), $payload);

        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('rental_applications', 1);
    }

    public function test_rental_application_requires_rental_history_fields_when_rented_before_is_yes(): void
    {
        Mail::fake();

        $apartment = Apartment::create([
            'title' => 'Unit 301',
            'description' => 'Nice apartment',
            'location' => 'Sydney',
            'price' => 1500,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'images' => [],
            'status' => 'available',
            'has_parking' => false,
        ]);

        $payload = $this->validPayload($apartment, [
            'application_data' => [
                'pets' => 'No',
                'viewed_property' => 'Yes',
                'viewing_availability' => '',
                'rented_before' => 'Yes',
                'current_rental_address' => '',
                'manager_name' => '',
                'manager_contact' => '',
                'rental_length' => '',
                'reason_for_moving' => '',
            ],
        ]);
        unset($payload['pet_photo']);

        $response = $this->post(route('forms.rental.store'), $payload);

        $response->assertSessionHasErrors([
            'application_data.current_rental_address',
            'application_data.manager_name',
            'application_data.manager_contact',
            'application_data.rental_length',
            'application_data.reason_for_moving',
        ]);
    }

    public function test_rental_application_requires_primary_and_coapplicant_employment_fields_when_employed_yes(): void
    {
        Mail::fake();

        $apartment = Apartment::create([
            'title' => 'Unit 401',
            'description' => 'Nice apartment',
            'location' => 'Sydney',
            'price' => 1700,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'images' => [],
            'status' => 'available',
            'has_parking' => false,
        ]);

        $payload = $this->validPayload($apartment, [
            'application_data' => [
                'pets' => 'No',
                'viewed_property' => 'Yes',
                'viewing_availability' => '',
                'employed' => 'Yes',
                'employer_name' => '',
                'income' => '',
                'supervisor_name' => '',
                'supervisor_contact' => '',
                'current_income_source' => '',
                'co_applicants' => [
                    [
                        'name' => 'Sam',
                        'last_name' => 'Blue',
                        'email' => 'sam@example.com',
                        'address' => '123 Main St',
                        'date_of_birth' => '1991-01-01',
                        'employed' => 'Yes',
                        'employer_name' => '',
                        'income' => '',
                        'supervisor_name' => '',
                        'supervisor_contact' => '',
                        'current_income_source' => '',
                    ],
                ],
            ],
        ]);
        unset($payload['pet_photo']);

        $response = $this->post(route('forms.rental.store'), $payload);

        $response->assertSessionHasErrors([
            'application_data.employer_name',
            'application_data.income',
            'application_data.supervisor_name',
            'application_data.supervisor_contact',
            'application_data.co_applicants.0.employer_name',
            'application_data.co_applicants.0.income',
            'application_data.co_applicants.0.supervisor_name',
            'application_data.co_applicants.0.supervisor_contact',
        ]);
    }

    private function validPayload(Apartment $apartment, array $overrides = []): array
    {
        $payload = [
            'applicant_name' => 'Jane Doe',
            'applicant_email' => 'jane@example.com',
            'applicant_phone' => '555-123-4567',
            'photo_id' => UploadedFile::fake()->create('photo-id.pdf', 100, 'application/pdf'),
            'pet_photo' => UploadedFile::fake()->image('pet-photo.jpg'),
            'relevant_files' => [
                UploadedFile::fake()->create('paystub.pdf', 100, 'application/pdf'),
            ],
            'application_data' => [
                'property_id' => $apartment->id,
                'property_title' => $apartment->title,
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'current_address' => '123 Main St',
                'city' => 'Sydney',
                'state' => 'NS',
                'date_of_birth' => '1990-01-01',
                'occupants_count' => 2,
                'pets' => 'Yes',
                'pets_count' => 1,
                'viewed_property' => 'No',
                'viewing_availability' => 'Monday 10am, Tuesday 3pm, Friday 1pm',
                'move_in_date' => '',
                'rented_before' => 'No',
                'current_rental_address' => '',
                'manager_name' => '',
                'manager_contact' => '',
                'rental_length' => '',
                'reason_for_moving' => '',
                'previous_rental_address' => '',
                'previous_manager_name' => '',
                'previous_manager_contact' => '',
                'previous_rental_length' => '',
                'vehicles' => 'No',
                'employed' => 'No',
                'employer_name' => '',
                'income' => '',
                'supervisor_name' => '',
                'supervisor_contact' => '',
                'current_income_source' => 'Scholarship',
                'co_applicants' => [
                    [
                        'name' => 'John',
                        'last_name' => 'Doe',
                        'email' => 'john@example.com',
                        'address' => '123 Main St',
                        'date_of_birth' => '1992-01-01',
                        'employed' => 'No',
                        'employer_name' => '',
                        'income' => '',
                        'supervisor_name' => '',
                        'supervisor_contact' => '',
                        'current_income_source' => 'Savings',
                    ],
                ],
                'why_consider_you' => 'Quiet and responsible tenant.',
                'criminal_offense' => 'No',
                'bankruptcy_or_consumer_proposal' => 'No',
                'terms_agreed' => '1',
            ],
        ];

        return array_replace_recursive($payload, $overrides);
    }
}
