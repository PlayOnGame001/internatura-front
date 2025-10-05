import type React from "react";

interface ArticleModalProps {
  article: {
    url: string;
    title: string;
    content: string;
  };
  loading: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  loading,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col gap-6 text-left">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>

        {loading ? (
          <p className="text-gray-500 py-12 text-center">Loading article...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {article.content}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Read full article →
            </a>
          </>
        )}
      </div>
    </div>
  );
};
