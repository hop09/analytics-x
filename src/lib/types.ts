export type LinkMode = "real" | "bot";

export interface Link {
    id: string;
    user_id: string;
    short_code: string;
    original_url: string;
    custom_title: string | null;
    custom_image_url: string | null;
    alt_page_url: string | null;
    bot_redirect_url: string | null;
    bot_custom_title: string | null;
    bot_custom_image_url: string | null;
    mode: LinkMode;
    created_at: string;
}

export interface Click {
    id: string;
    link_id: string;
    user_agent: string | null;
    country: string | null;
    device_type: string | null;
    is_bot: boolean;
    referrer: string | null;
    created_at: string;
}

export interface LinkWithClicks extends Link {
    clicks: Click[];
    click_count: number;
}

export interface LinkStats {
    total_clicks: number;
    human_clicks: number;
    bot_clicks: number;
    top_countries: { country: string; count: number }[];
    top_devices: { device: string; count: number }[];
    clicks_over_time: { date: string; count: number }[];
    top_referrers: { referrer: string; count: number }[];
    top_user_agents: { user_agent: string; count: number; is_bot: boolean }[];
}

export interface DashboardStats {
    total_clicks: number;
    total_links: number;
    human_clicks: number;
    bot_clicks: number;
}
