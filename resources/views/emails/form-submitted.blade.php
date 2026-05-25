<!DOCTYPE html>
<html>
<head>
    <title>New {{ $formType }} Submission</title>
</head>
<body>
    <h2>New Submission: {{ $formType }}</h2>
    <p>A new form has been submitted on the website. Here are the details:</p>
    
    <table border="1" cellpadding="10" cellspacing="0">
        @foreach($formData as $key => $value)
            <tr>
                <th>{{ ucwords(str_replace('_', ' ', $key)) }}</th>
                <td>
                    @if(is_array($value))
                        <pre>{{ json_encode($value, JSON_PRETTY_PRINT) }}</pre>
                    @else
                        {{ $value }}
                    @endif
                </td>
            </tr>
        @endforeach
    </table>
</body>
</html>
