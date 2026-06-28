import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "Home", href: "/" },
            { name: "Generate Thumbnail", href: "/generate" },
            { name: "My Gallery", href: "/my-generation" },
            { name: "YT Preview", href: "/preview" },
        ]
    },
    {
        title: "Resources",
        links: [
            { name: "Features", href: "/#features" },
            { name: "Pricing", href: "/#pricing" },
            { name: "Testimonials", href: "/#testimonials" },
            { name: "Contact Us", href: "/#contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
        ]
    }
];