import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Basic",
        price: 0,
        period: "month",
        features: [
            "5 Free AI thumbnails (one-time)",
            "Standard 1080p resolution",
            "All basic styles & color schemes",
            "No watermarks",
            "Commercial usage rights"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 3,
        period: "month",
        features: [
            "100 AI thumbnails",
            "Ultra-HD 4K resolution",
            "Access to premium AI styles",
            "Priority generation queue",
            "Advanced text & face enhancement",
            "24/7 Priority support"
        ],
        mostPopular: true
    },
    {
        name: "Enterprise",
        price: 5,
        period: "month",
        features: [
            "500 AI thumbnails",
            "Everything in Pro",
            "Multiple team accounts",
            "Custom style fine-tuning",
            "API access for automation",
            "Dedicated account manager"
        ],
        mostPopular: false
    }
];