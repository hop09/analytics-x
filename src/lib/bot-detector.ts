const BOT_PATTERNS = [
    "facebookexternalhit",
    "facebookcatalog",
    "Facebot",
    "TikTokBot",
    "Twitterbot",
    "LinkedInBot",
    "WhatsApp",
    "Slackbot",
    "Discordbot",
    "Telegrambot",
    "Googlebot",
    "bingbot",
    "Baiduspider",
    "YandexBot",
    "DuckDuckBot",
    "Applebot",
    "PinterestBot",
    "Redditbot",
    "Snapchat",
    "vkShare",
    "Viber",
    "Tumblr",
    "Embedly",
    "Quora Link Preview",
    "Showyoubot",
    "outbrain",
    "W3C_Validator",
    "rogerbot",
    "Sogou",
    "Exabot",
    "ia_archiver",
    "Google-Structured-Data-Testing-Tool",
    "developers.google.com/+/web/snippet",
];

const botRegex = new RegExp(BOT_PATTERNS.join("|"), "i");

export function isBot(userAgent: string | null | undefined): boolean {
    if (!userAgent) return false;
    return botRegex.test(userAgent);
}

export function detectDevice(userAgent: string | null | undefined): string {
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
    if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return "Mobile";
    return "Desktop";
}
