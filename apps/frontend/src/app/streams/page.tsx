import { api, type StreamsResponse } from '@/lib/api';
import StreamsDateFilter from '@/components/StreamsDateFilter';
import Sidebar from '@/components/Sidebar';
import StreamsHero from '@/components/streams/StreamsHero';
import StreamsListInfinite from '@/components/streams/StreamsListInfinite';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

interface SearchParams {
  date?: string;
  region?: string;
  search?: string;
  sort?: string;
}

export default async function StreamsPage({ searchParams }: { searchParams: SearchParams }) {
  const today = new Date().toISOString().split('T')[0];
  const date = searchParams.date || today;
  const search = searchParams.search || '';
  const sort = searchParams.sort || 'important';

  const streamsData = await api.streams.getStreams(searchParams.region, date, 1, 20, search, sort).catch(() => ({ date, items: [] }));
  const leagues = await api.leagues.getLeagues().catch(() => ({ items: [], total: 0 }));

  const streamsRes = streamsData as StreamsResponse;
  const initialMatches = streamsRes.items || [];
  const initialPage = streamsRes.page || 1;
  const initialTotal = streamsRes.total || 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar - Now on the Left */}
        <aside className="w-full lg:w-[360px] shrink-0 order-2 lg:order-1">
          <div className="sticky top-24">
             <div className="mb-8">
               <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                 <span className="w-2 h-8 bg-brand-emerald rounded-full"></span>
                 Competitions
               </h2>
               <Sidebar 
                 leagueData={Array.isArray(leagues) ? leagues : (leagues.items || [])} 
                 initialTotal={Array.isArray(leagues) ? 0 : (leagues.total || 0)}
                 mode="predictions" 
                 hidePrediction={true}
                 hideCompetitionHeader={true}
               />
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 order-1 lg:order-2">
          {/* Hero Section */}
          <StreamsHero />

          {/* Date Filter */}
          <div className="mb-8">
            <StreamsDateFilter initialDate={date} />
          </div>

          {initialMatches.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center shadow-xl shadow-slate-200/50">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                 <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
              </div>
              <h3 className="text-slate-800 text-xl font-black mb-2">No active streams found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">There are no football matches available for streaming on this date. Please check another day.</p>
            </div>
          ) : (
            <StreamsListInfinite 
              initialMatches={initialMatches}
              initialPage={initialPage}
              initialTotal={initialTotal}
              selectedDate={date}
              region={searchParams.region}
              search={search}
              sort={sort}
            />
          )}

          {/* Bottom Information Card */}
          <div className="mt-16 bg-white rounded-[40px] border border-slate-100 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
             {/* Decorative blurry circles */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-emerald/10 rounded-full blur-3xl opacity-50" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-emerald/10 rounded-full blur-3xl opacity-50" />

             <div className="relative z-10">
               <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8 tracking-tight">
                 Live Streams {new Date(date).toLocaleDateString('en-GB')}
               </h2>
               
               <div className="space-y-8 text-slate-600 leading-relaxed text-base sm:text-lg">
                  <p>
                    <strong className="text-slate-900">APWin</strong> delivers the <strong className="text-slate-900">top options for watching football live and for free</strong>. With the information on our platform, users who like to enjoy football live can know where they can watch today&apos;s games for free and follow their favourite team closely.
                  </p>
                  <p>
                    In addition to providing the complete list of channels that will show today&apos;s games, APWin also allows you to watch football live and online in <strong className="text-slate-900">HD</strong> on mobile devices such as cell phones, tablets and even on your computer. Everything is directly connected to our website.
                  </p>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-brand-emerald rounded-full"></span>
                      Important Considerations
                    </h3>
                    
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none !pl-0">
                       <li className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors group">
                          <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-emerald/10 flex items-center justify-center text-[10px] text-brand-emerald font-black">1</span>
                            Website Terms:
                          </div>
                          <span className="text-sm text-slate-500">Some bookmakers may offer live streams, generally subject to their terms and conditions. Read T&Cs carefully.</span>
                       </li>
                       <li className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors group">
                          <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-emerald/10 flex items-center justify-center text-[10px] text-brand-emerald font-black">2</span>
                            Account creation:
                          </div>
                          <span className="text-sm text-slate-500">In many cases, you may need to create an account with a betting site to access live streams.</span>
                       </li>
                       <li className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors group">
                          <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-emerald/10 flex items-center justify-center text-[10px] text-brand-emerald font-black">3</span>
                            Local restrictions:
                          </div>
                          <span className="text-sm text-slate-500">Many betting sites have geographic restrictions that limit access based on your location.</span>
                       </li>
                       <li className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors group">
                          <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-emerald/10 flex items-center justify-center text-[10px] text-brand-emerald font-black">4</span>
                            Stream Quality:
                          </div>
                          <span className="text-sm text-slate-500">Streams quality may vary. Test different platforms to find the best HD option.</span>
                       </li>
                    </ul>
                  </div>
                  
                  <p className="pt-8 border-t border-slate-100 italic text-sm text-slate-400 font-medium">
                    It&apos;s worth remembering that the availability of live football streams may change, and it is important to respect the copyright and terms of use of digital streaming platforms. Always opt for legal methods to support your club and the sports industry.
                  </p>
               </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

