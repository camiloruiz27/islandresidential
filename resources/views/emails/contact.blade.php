<x-mail::message>
# New Contact Form Submission

A new message has been submitted via the contact form on Island Residential.

**Name:** {{ $data['name'] }}
**Email:** {{ $data['email'] }}
**Phone:** {{ $data['phone'] ?? 'N/A' }}

**Message:**
{{ $data['message'] }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
