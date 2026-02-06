import AuthorCard from '@/components/Authors/AuthorCard';

export default function AuthorsPage() {
  const authors = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Content Manager',
      imageUrl: '',
      link: '/authors/john-doe'
    },
    {
      id: 2,
      name: 'Michael Smith',
      role: 'Content Producer',
      imageUrl: '',
      link: '/authors/michael-smith'
    },
    {
      id: 3,
      name: 'David Johnson',
      role: 'Senior Analyst',
      imageUrl: '',
      link: '/authors/david-johnson'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">OddinsOdds Authors</h1>
        <p className="text-slate-500 font-medium">
           Meet the passionate authors at OddinsOdds, delivering top-notch football stats and insightful analysis
        </p>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
        {authors.map((author) => (
          <AuthorCard 
            key={author.id}
            name={author.name}
            role={author.role}
            imageUrl={author.imageUrl}
            link={author.link}
          />
        ))}
      </div>



    </div>
  );
}
