import { supabase } from '@/lib/supabaseClient';
import { getStoredSettings } from '@/utils/settings';

export interface NewsArticle {
    title: string;
    url: string;
    source: {
        name: string;
    };
    publishedAt: string;
    description?: string;
    urlToImage?: string;
}

export interface FetchNewsResponse {
    articles: NewsArticle[];
    _mock?: boolean;
}

export const fetchCompanyNews = async (company: string): Promise<FetchNewsResponse> => {
    try {
        const settings = getStoredSettings();
        const { data, error } = await supabase.functions.invoke('fetch-news', {
            body: {
                company,
                apiKey: settings.newsApiKey
            },
        });

        if (error) throw error;

        return data as FetchNewsResponse;
    } catch (error) {
        console.error('Error fetching news:', error);
        return { articles: [] };
    }
};
