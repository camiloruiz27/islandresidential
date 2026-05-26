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
                    {{-- Ignore file metadata arrays from rendering directly, as they are attached --}}
                    @if(in_array($key, ['photos', 'files', 'created_at', 'updated_at', 'id']))
                        @continue
                    @endif
                    
                    <tr>
                        <th>{{ ucwords(str_replace('_', ' ', $key)) }}</th>
                        <td>
                            @if(is_array($value))
                                <table class="nested-table">
                                    @foreach($value as $subKey => $subValue)
                                        {{-- Ignore file paths in nested data --}}
                                        @if(str_contains((string)$subKey, 'path'))
                                            @continue
                                        @endif
                                        <tr>
                                            <th>{{ ucwords(str_replace('_', ' ', $subKey)) }}</th>
                                            <td>
                                                @if(is_bool($subValue))
                                                    {{ $subValue ? 'Yes' : 'No' }}
                                                @elseif(is_array($subValue))
                                                    JSON Data
                                                @else
                                                    {{ $subValue ?: '—' }}
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </table>
                            @else
                                @if(is_bool($value))
                                    {{ $value ? 'Yes' : 'No' }}
                                @else
                                    {!! nl2br(e($value ?: '—')) !!}
                                @endif
                            @endif
                        </td>
                    </tr>
                @endforeach
            </table>

            @if((isset($formData['photos']) && count($formData['photos']) > 0) || (isset($formData['files']) && count($formData['files']) > 0))
                <div class="attachment-notice">
                    <strong>📎 Attachments Included</strong><br>
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
