import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

export function useSEO({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime
}: SEOProps) {
    useEffect(() => {
        // Título da página
        if (title) {
            document.title = `${title} - VitallCheck-Up Odontologia`;
        }

        // Meta description
        if (description) {
            updateMetaTag('description', description);
        }

        // Keywords
        if (keywords.length > 0) {
            updateMetaTag('keywords', keywords.join(', '));
        }

        // Open Graph tags
        updateMetaProperty('og:title', title || 'VitallCheck-Up Odontologia');
        updateMetaProperty('og:description', description || 'Clínica odontológica com foco em saúde bucal e bem-estar');
        updateMetaProperty('og:type', type);
        updateMetaProperty('og:site_name', 'VitallCheck-Up Odontologia');

        if (image) {
            updateMetaProperty('og:image', image);
            updateMetaProperty('og:image:alt', title || 'VitallCheck-Up');
        }

        if (url) {
            updateMetaProperty('og:url', url);
        }

        // Twitter Card tags
        updateMetaName('twitter:card', 'summary_large_image');
        updateMetaName('twitter:title', title || 'VitallCheck-Up Odontologia');
        updateMetaName('twitter:description', description || 'Clínica odontológica com foco em saúde bucal e bem-estar');

        if (image) {
            updateMetaName('twitter:image', image);
        }

        // Article specific tags
        if (type === 'article') {
            if (author) {
                updateMetaProperty('article:author', author);
            }
            if (publishedTime) {
                updateMetaProperty('article:published_time', publishedTime);
            }
            if (modifiedTime) {
                updateMetaProperty('article:modified_time', modifiedTime);
            }
            updateMetaProperty('article:section', 'Saúde Bucal');
        }

        // Schema.org JSON-LD
        const schemaData = createSchemaData({
            title,
            description,
            image,
            url,
            type,
            author,
            publishedTime,
            modifiedTime
        });

        updateJsonLd(schemaData);

    }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);
}

function updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function updateMetaName(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function createSchemaData({
    title,
    description,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime
}: SEOProps) {
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": type === 'article' ? "BlogPosting" : "WebSite",
        "name": title || "VitallCheck-Up Odontologia",
        "description": description || "Clínica odontológica especializada em saúde bucal e bem-estar",
        "url": url || window.location.href,
        "publisher": {
            "@type": "Organization",
            "name": "VitallCheck-Up Odontologia",
            "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "R. Cel. Souza Franco, 904",
                "addressLocality": "Mogi das Cruzes",
                "addressRegion": "SP",
                "addressCountry": "BR"
            },
            "telephone": "+55 11 93455-0921"
        }
    };

    if (type === 'article') {
        return {
            ...baseSchema,
            "@type": "BlogPosting",
            "headline": title,
            "image": image ? [image] : undefined,
            "author": {
                "@type": "Person",
                "name": author || "VitallCheck-Up Team"
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            }
        };
    }

    return baseSchema;
}

function updateJsonLd(data: any) {
    // Remove existing JSON-LD
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
        existing.remove();
    }

    // Add new JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

// Utility function to generate SEO-friendly slugs
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate meta description from content
export function generateMetaDescription(content: string, maxLength: number = 155): string {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');

    // Truncate to maxLength and add ellipsis if needed
    if (textContent.length <= maxLength) {
        return textContent;
    }

    // Find the last complete word within the limit
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
}

// Extract keywords from content
export function extractKeywords(title: string, content: string, category: string): string[] {
    const commonWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'e', 'ou', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'que', 'se', 'é', 'são', 'foi', 'como', 'mais', 'muito', 'pode', 'ter', 'seu', 'sua', 'seus', 'suas'];

    const textContent = (title + ' ' + content + ' ' + category)
        .toLowerCase()
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/[^a-záàâãéèêíìîóòôõúùûç\s]/g, '') // Keep only letters and spaces
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    textContent.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);
}

export default useSEO; 