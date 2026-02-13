import { getArticleDetail } from '@/lib/api';
import Link from 'next/link';

// ISR: Revalidate every 6 hours
export const revalidate = 21600;

interface PageProps {
  params: {
    type: string;
    slug: string;
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const article = await getArticleDetail(params.type as 'academy' | 'blog', params.slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href={`/${params.type}`} className="text-primary-600 hover:underline">
          ← Back to {params.type === 'academy' ? 'Academy' : 'Blog'}
        </Link>
      </nav>

      {/* Article Header */}
      <article className="card">
        {article.category && (
          <div className="inline-block bg-primary-100 text-primary-800 text-sm px-4 py-1 rounded-full mb-4">
            {article.category}
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
          {article.publishedAt && (
            <span>
              Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
          {article.updatedAt && article.updatedAt !== article.publishedAt && (
            <span className="ml-4">
              • Updated on {new Date(article.updatedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Summary */}
        {article.summary && (
          <div className="text-xl text-gray-700 mb-8 italic">
            {article.summary}
          </div>
        )}

        {/* Body (Markdown rendered as plain text for now) */}
        {article.bodyMd && (
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800">{article.bodyMd}</div>
          </div>
        )}
      </article>
    </div>
  );
}

