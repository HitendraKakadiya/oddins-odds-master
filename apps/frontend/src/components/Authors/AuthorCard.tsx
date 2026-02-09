import Link from 'next/link';

interface AuthorCardProps {
  name: string;
  role: string;
  imageUrl?: string;
  link: string;
}

export default function AuthorCard({ name, role, imageUrl, link }: AuthorCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-slate-100 border-4 border-slate-50 relative">
        {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-100 to-purple-50">
               👨‍💻
            </div>
        )}
      </div>
      
      <h3 className="font-black text-xl text-slate-900 mb-1">{name}</h3>
      <p className="text-sm font-medium text-slate-400 mb-6">{role}</p>
      
      <Link 
        href={link} 
        className="inline-block bg-brand-pink text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-pink/20 hover:scale-105 transition-transform active:scale-95"
      >
        Learn More
      </Link>
    </div>
  );
}
