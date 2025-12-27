import React from 'react';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';
import { NewsArticle } from '@/services/newsService';


interface NewsFeedProps {
    articles: NewsArticle[];
    isLoading: boolean;
    isMock?: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ articles, isLoading, isMock }) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-white/5 rounded-lg p-4 h-24" />
                ))}
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-500">
                <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Aucune actualité récente trouvée.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {isMock && (
                <div className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded border border-blue-500/20 mb-2">
                    Mode Simulation (Configurez NewsAPI dans les paramètres pour le mode réel)
                </div>
            )}

            {articles.map((article, index) => (
                <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm text-neutral-200 group-hover:text-astro-gold transition-colors line-clamp-2">
                                {article.title}
                            </h4>
                            <ExternalLink size={14} className="text-neutral-500 group-hover:text-white shrink-0 mt-1" />
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                            <span className="bg-white/5 px-1.5 py-0.5 rounded text-neutral-400">
                                {article.source.name}
                            </span>
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};
