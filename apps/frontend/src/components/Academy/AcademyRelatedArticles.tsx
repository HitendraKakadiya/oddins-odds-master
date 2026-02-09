export default function AcademyRelatedArticles() {
  const articles = [
    {
      title: 'Guides for All Bet Types',
      icon: '📚'
    },
    {
      title: 'Betting Strategies',
      icon: '♟️'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {article.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-indigo transition-colors leading-snug">
              {article.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
