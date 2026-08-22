import { Head } from '@inertiajs/react';

const SITE_NAME = 'Island Residential';
const SITE_URL = 'https://islandresidential.ca';
const DEFAULT_IMAGE = `${SITE_URL}/images/island-residential-apartments-cape-breton-coastal-view.jpg`;

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE };

export function absoluteUrl(path = '/') {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function SeoHead({
    title,
    description,
    path = '/',
    image = DEFAULT_IMAGE,
    type = 'website',
    robots = 'index, follow',
    structuredData = [],
}) {
    const canonical = absoluteUrl(path);
    const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];

    return (
        <Head title={title}>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={absoluteUrl(image)} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteUrl(image)} />

            {schemas.filter(Boolean).map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
