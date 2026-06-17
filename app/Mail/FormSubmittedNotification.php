<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FormSubmittedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $formData;
    public $formType;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($formData, $formType)
    {
        $this->formData = $formData;
        $this->formType = $formType;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        $subjectPrefix = app()->environment('local') ? '[TEST EMAIL] ' : '';

        return new Envelope(
            subject: $subjectPrefix . 'New Submission: ' . $this->formType,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.form-submitted',
            with: [
                'formData' => $this->formData,
                'formType' => $this->formType,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        $attachments = [];

        // Check for photos in Maintenance Request
        if (isset($this->formData['photos']) && is_array($this->formData['photos'])) {
            foreach ($this->formData['photos'] as $photoPath) {
                $absolutePath = storage_path('app/public/' . $photoPath);
                if (file_exists($absolutePath)) {
                    $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromPath($absolutePath);
                }
            }
        }

        // Check for files in Rental Application
        if (isset($this->formData['files']) && is_array($this->formData['files'])) {
            foreach ($this->formData['files'] as $fileData) {
                if (isset($fileData['path'])) {
                    $disk = $fileData['disk'] ?? 'local';
                    $absolutePath = $disk === 'public' 
                        ? storage_path('app/public/' . $fileData['path']) 
                        : storage_path('app/' . $fileData['path']);
                        
                    if (file_exists($absolutePath)) {
                        $attachment = \Illuminate\Mail\Mailables\Attachment::fromPath($absolutePath);
                        if (isset($fileData['name'])) {
                            $attachment->as($fileData['name']);
                        }
                        $attachments[] = $attachment;
                    }
                }
            }
        }

        return $attachments;
    }
}
