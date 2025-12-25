import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
    const siteTitle = "صيدليات معرة مصرين";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || "دليل صيدليات معرة مصرين المناوبة - اعثر على أقرب صيدلية إليك بسهولة";

    const defaultKeywords = "صيدليات المعرة, صيدليات معرة النعمان, صيدلية مناوبة, جدول المناوبات, ادوية المعرة, صحة معرة النعمان, ارقام صيدليات ادلب, دليل صيدليات المعرة, مناوبات الصيدليات اليوم, اقرب صيدلية, مستودعات ادوية, اسعار الادوية, البحث عن دواء, خفارة الصيدليات, الهيئة الصحية في ادلب, صيدليات ريف ادلب, الدوام الليلي للصيدليات, maarrat al-numan pharmacy, duty pharmacy idlib";
    const currentKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={metaDescription} />
            <meta name='keywords' content={currentKeywords} />

            {/* Open Graph tags for social media */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
