import { getArticles, type Article } from '@/lib/api';
import Link from 'next/link';

// ISR: Revalidate every 6 hours
export const revalidate = 21600;

export default async function AcademyPage() {
  const articlesData = await getArticles('academy').catch(() => ({ page: 1, pageSize: 20, total: 0, items: [] }));
  const articles = articlesData.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Betting Academy</h1>
        <p className="text-lg text-gray-600">
          Learn strategies, tips, and best practices for smarter betting
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No articles available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article) => (
            <Link
              key={article.id}
              href={`/articles/${article.type}/${article.slug}`}
              className="card hover:shadow-lg transition-shadow"
            >
              {article.category && (
                <div className="inline-block bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full mb-3">
                  {article.category}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
              {article.publishedAt && (
                <div className="text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
