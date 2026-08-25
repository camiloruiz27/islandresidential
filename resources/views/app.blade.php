<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#0a0a0a">
        <meta name="application-name" content="{{ config('app.name', 'Island Residential') }}">
        <meta name="description" content="Island Residential offers professionally managed apartments for rent in Sydney, Nova Scotia and across Cape Breton.">
        <meta property="og:site_name" content="Island Residential">
        <meta property="og:title" content="Island Residential | Apartments for Rent in Sydney, NS & Cape Breton">
        <meta property="og:description" content="Professionally managed apartments and rental properties in Sydney, NS and across Cape Breton.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://islandresidential.ca/">
        <meta property="og:image" content="https://islandresidential.ca/images/island-residential-apartments-cape-breton-coastal-view.jpg">

        <title inertia>{{ config('app.name', 'Island Residential') }}</title>
        <link rel="icon" type="image/png" href="/images/media__1779672706495.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Google Analytics (mandatory - production only) -->
        @if(!app()->environment('local'))
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ELC895716M"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELC895716M');
        </script>
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <noscript>
            <main>
                <h1>Island Residential Apartments for Rent in Sydney, NS and Cape Breton</h1>
                <p>Island Residential offers professionally managed apartments and rental properties in Sydney, Nova Scotia and across Cape Breton.</p>
                <p>
                    <a href="/properties">Available apartments</a>
                    <a href="/forms/rental">Rental application</a>
                    <a href="mailto:rent@islandresidential.ca">rent@islandresidential.ca</a>
                </p>
            </main>
        </noscript>
        @inertia
    </body>
</html>
