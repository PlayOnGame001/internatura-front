import { useState, useEffect } from "react";
import Banner from "../UI/banner";
import { ArticleModal } from "../UI/ArticleModal";
import type { Bidder } from "../utilits/ad";
import { getFeeds, parseFeed, parseArticle } from "../data/Api/api";
import { tracker } from "../utilits/EventTracker";

interface FeedArticle {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  guid?: string;
}

interface ParsedArticle {
  url: string;
  title: string;
  content: string;
}

interface ArticleCardProps {
  article: FeedArticle;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('uk-UA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl cursor-pointer transition-all transform hover:scale-105 w-full max-w-md"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <h2 className="font-bold text-xl mb-3 text-gray-900 line-clamp-3">
          {article.title}
        </h2>
        
        {article.pubDate && (
          <p className="text-sm text-gray-500 mb-3">
            📅 {formatDate(article.pubDate)}
          </p>
        )}
        
        {article.content && (
          <p className="text-gray-600 text-sm line-clamp-4 flex-grow">
            {article.content.replace(/<[^>]*>/g, '').substring(0, 200)}
            {article.content.length > 200 ? '...' : ''}
          </p>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-blue-600 font-medium text-sm hover:text-blue-800 transition">
            Read all →
          </span>
        </div>
      </div>
    </div>
  );
};

export default function PageNews() {
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ParsedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [articleLoading, setArticleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adBidders: Bidder[] = [{ bidder: "adtelligent", params: { aid: 350975 } }];

  useEffect(() => {
     tracker.start();
    tracker.track({
      type: "load_page",
      timestamp: new Date().toISOString(),
    });

    async function loadUnianNews() {
      try {
        setLoading(true);
        const feeds = await getFeeds();
        const unianFeed = feeds.find((feed: { title: string; }) => 
          feed.title?.toLowerCase().includes('уніан') || 
          feed.title?.toLowerCase().includes('unian')
        );
        
        if (!unianFeed) {
          setError('UNIAN news source not found');
          return;
        }
        const feedArticles = await parseFeed(unianFeed.url);
        const sortedArticles = feedArticles
          .sort((a: { pubDate: string | number | Date; }, b: { pubDate: string | number | Date; }) => {
            const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 2);
        
        setArticles(sortedArticles);
      } catch (err) {
        let errorMessage = 'Failed to download news';
        
        if (err instanceof Error) {
          if (err.message.includes('500')) {
            errorMessage = 'The server cannot process the RSS feed. The feed may be unavailable.';
          } else if (err.message.includes('404')) {
            errorMessage = 'RSS feed not found.';
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to the server. Check if the backend is running on' + 
                         (import.meta.env.VITE_API_URL || 'http://localhost:3000');
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadUnianNews();
    const interval = setInterval(loadUnianNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleArticleClick = async (article: FeedArticle) => {
    if (!article.link) return;
    
    setArticleLoading(true);
    try {
      const fullArticle = await parseArticle(article.link);
      setSelectedArticle(fullArticle);
    } catch (err) {
      let errorMessage = 'Failed to load full text of article';
      
      if (err instanceof Error) {
        if (err.message.includes('500')) {
          errorMessage = 'The server cannot process this article. Try opening the link in a browser.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Article not found.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setArticleLoading(false);
    }
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Download error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
          Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Neew Feeds</h1>

      <div className="flex gap-6 justify-center">
        <div className="hidden lg:block">
          <Banner id="banner-left" sizes={[[300, 250]]} bidders={adBidders} />
        </div>

        <div className="flex-1 max-w-3xl">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <p className="text-xl text-gray-500">No news available</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.guid || article.link || index}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Banner id="banner-right" sizes={[[300, 250]]} bidders={adBidders} />
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          loading={articleLoading}
          onClose={closeArticleModal}
        />
      )}
    </div>
  );
}