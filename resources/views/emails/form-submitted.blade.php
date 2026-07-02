<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New {{ $formType }} Submission</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
            color: #111827;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.05em;
        }
        .header h1 span {
            font-weight: 700;
        }
        .content {
            padding: 40px;
        }
        .intro {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            text-align: center;
        }
        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid #f3f4f6;
            border-radius: 8px;
            overflow: hidden;
        }
        .data-table th, .data-table td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
        }
        .data-table tr:last-child th, .data-table tr:last-child td {
            border-bottom: none;
        }
        .data-table th {
            background-color: #f9fafb;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            width: 35%;
        }
        .data-table td {
            font-size: 14px;
            font-weight: 500;
            word-break: break-word;
        }
        .nested-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        .nested-table th, .nested-table td {
            padding: 8px 0;
            border-bottom: 1px dashed #e5e7eb;
            font-size: 13px;
        }
        .nested-table tr:last-child th, .nested-table tr:last-child td {
            border-bottom: none;
        }
        .nested-table th {
            color: #6b7280;
            font-weight: 600;
            width: 40%;
            background: none;
            letter-spacing: normal;
            text-transform: none;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .badge {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .attachment-notice {
            margin-top: 30px;
            padding: 15px;
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            color: #166534;
            font-size: 13px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Island <span>Residential</span></h1>
        </div>

        <div class="content">
            <div style="text-align: center;">
                <div class="badge">New Submission</div>
            </div>
            <div class="intro">
                A new <strong>{{ $formType }}</strong> has been submitted through the website. Here are the details:
            </div>

            <table class="data-table">
                @foreach($formData as $key => $value)
                    @if(in_array($key, ['photos', 'files', 'created_at', 'updated_at', 'id']))
                        @continue
                    @endif

                    @if($key === 'apartment_id')
                        <tr>
                            <th>Apartment</th>
                            <td>
                                @php($propertyTitle = data_get($formData, 'application_data.property_title'))
                                @if($value && $propertyTitle)
                                    {{ $value }} - {{ $propertyTitle }}
                                @elseif($propertyTitle)
                                    {{ $propertyTitle }}
                                @else
                                    {{ $value ?: '-' }}
                                @endif
                            </td>
                        </tr>
                        @continue
                    @endif

                    <tr>
                        <th>{{ ucwords(str_replace('_', ' ', $key)) }}</th>
                        <td>
                            @if(is_array($value))
                                <table class="nested-table">
                                    @foreach($value as $subKey => $subValue)
                                        @if(str_contains((string) $subKey, 'path') || $subKey === 'property_title')
                                            @continue
                                        @endif
                                        <tr>
                                            <th>{{ $subKey === 'property_id' ? 'Property' : ucwords(str_replace('_', ' ', $subKey)) }}</th>
                                            <td>
                                                @if($subKey === 'property_id')
                                                    @php($nestedPropertyTitle = $value['property_title'] ?? null)
                                                    @if($subValue && $nestedPropertyTitle)
                                                        {{ $subValue }} - {{ $nestedPropertyTitle }}
                                                    @elseif($nestedPropertyTitle)
                                                        {{ $nestedPropertyTitle }}
                                                    @else
                                                        {{ $subValue ?: '-' }}
                                                    @endif
                                                @elseif($subKey === 'terms_agreed')
                                                    @if($subValue)
                                                        <strong>The applicant accepted the Terms and Conditions and Privacy Policy.</strong>
                                                        <br><br>
                                                        By checking this box, I (we), the Applicant(s), explicitly authorize and consent to the Landlord or their agent obtaining and viewing credit, financial, and related personal or business information, as well as tenancy history about the Applicant (including credit reports, credit scores, and tenant records) from past and present Landlords and from credit reporting agencies (such as Equifax, TransUnion, and the Landlord Credit Bureau) from time to time for the purposes of assessing the Applicant's current and ongoing eligibility for tenancy. The Applicant(s) grant permission to contact the references listed in this application, both now and in the future, for rental consideration. The Applicant(s) acknowledge and understand that personal information will be collected, processed, and stored in accordance with the Terms and Conditions and Privacy Policy for now and future rental applications or for collections purposes should they be deemed necessary. The consents provided are effective as of the date of this Application and will remain valid for as long as required to fulfill the purposes described herein.
                                                    @else
                                                        The applicant did not accept the Terms and Conditions and Privacy Policy.
                                                    @endif
                                                @elseif(is_bool($subValue))
                                                    {{ $subValue ? 'Yes' : 'No' }}
                                                @elseif(is_array($subValue))
                                                    JSON Data
                                                @else
                                                    {{ $subValue ?: '-' }}
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </table>
                            @else
                                @if(is_bool($value))
                                    {{ $value ? 'Yes' : 'No' }}
                                @else
                                    {!! nl2br(e($value ?: '-')) !!}
                                @endif
                            @endif
                        </td>
                    </tr>
                @endforeach
            </table>

            @if((isset($formData['photos']) && count($formData['photos']) > 0) || (isset($formData['files']) && count($formData['files']) > 0))
                <div class="attachment-notice">
                    <strong>Attachments Included</strong><br>
                    Files uploaded by the user have been securely attached to this email.
                </div>
            @endif
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Island Residential. This is an automated message.
        </div>
    </div>
</body>
</html>
