import { getArticles, type Article } from '@/lib/api';
import Link from 'next/link';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export default async function BlogPage() {
  const articlesData = await getArticles('blog').catch(() => ({ page: 1, pageSize: 20, total: 0, items: [] }));
  const articles = articlesData.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-lg text-gray-600">
          Latest news, insights, and analysis from the world of football betting
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts available yet</p>
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
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
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

