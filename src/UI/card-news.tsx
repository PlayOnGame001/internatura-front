import type React from "react";
import type { Feed } from "../types/Feed.type";

interface NewsCardProps {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	onClick?: () => void;
	className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
	title,
	icon: Icon,
	onClick,
	className = "",
}) => {
	const baseClasses =
		"bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition transform hover:scale-105 flex flex-col items-center";

	const classes = `${baseClasses} ${className}`.trim();

	return (
		<div className={classes} onClick={onClick}>
			<Icon className="w-32 h-32 mb-2" />
			<h2 className="font-semibold text-lg text-center text-gray-900">
				{title}
			</h2>
		</div>
	);
};

interface FeedArticle {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  guid?: string;
}

interface FeedModalProps {
  feed: Feed;
  articles: FeedArticle[];
  loading: boolean;
  onClose: () => void;
  onArticleClick: (article: FeedArticle) => void;
}

export const FeedModal: React.FC<FeedModalProps> = ({ 
  feed, 
  articles, 
  loading, 
  onClose, 
  onArticleClick 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="mb-4 pr-12">
          <h2 className="text-2xl font-bold text-gray-900">{feed.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{feed.url}</p>
        </div>

        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition"
          onClick={onClose}
        >
          ×
        </button>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xl text-gray-500">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xl text-gray-500">No news available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div
                  key={article.guid || article.link || index}
                  className="bg-gray-50 rounded-lg p-5 cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all border border-gray-200"
                  onClick={() => onArticleClick(article)}
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600 transition">
                    {article.title}
                  </h3>
                  {article.pubDate && (
                    <p className="text-sm text-gray-500 mb-2">
                      📅 {new Date(article.pubDate).toLocaleString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {article.content && (
                    <p className="text-gray-700 line-clamp-3">
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 250)}
                      {article.content.length > 250 ? '...' : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};