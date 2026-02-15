import AuthorCard from '@/components/Authors/AuthorCard';
import OfferSection from '@/components/About/OfferSection';

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-6 sm:pb-8">
      
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4 leading-tight">OddinsOdds Authors</h1>
        <p className="text-slate-500 font-medium text-xs sm:text-base max-w-2xl mx-auto px-4">
           Meet the passionate authors at OddinsOdds, delivering top-notch football stats and insightful analysis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-16 sm:mb-20">
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

      <div className="max-w-7xl mx-auto">
        <OfferSection />
      </div>



    </div>
  );
}
