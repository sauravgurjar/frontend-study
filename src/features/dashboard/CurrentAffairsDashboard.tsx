import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Clock3,
  Flame,
  NotebookText,
  Search,
  Share2,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { actionCards, affairsArticles } from './dashboardContent';

const accentStyles: Record<'blue' | 'teal', string> = {
  blue: 'bg-blue-100 text-blue-700',
  teal: 'bg-teal-100 text-teal-700'
};

const GS_PAPERS = ['GS Paper I', 'GS Paper II', 'GS Paper III', 'GS Paper IV'] as const;

export const CurrentAffairsDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<'latest' | (typeof GS_PAPERS)[number]>('latest');
  const [isGsMenuOpen, setIsGsMenuOpen] = useState(false);
  const gsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!gsMenuRef.current?.contains(event.target as Node)) {
        setIsGsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="flex-1 bg-transparent px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
      <section className="mx-auto max-w-[928px]">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Master UPSC Current Affairs
            <br className="hidden sm:block" /> Every Day
          </h2>
          <p className="mt-4 max-w-xl text-sm text-slate-600 sm:mt-6 sm:text-base">
            Synthesized intelligence from The Hindu, Indian Express, and PIB. Your focus, our analysis.
          </p>

          <div className="mt-5 flex h-12 max-w-2xl items-center gap-2 rounded-full border border-slate-300 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 sm:h-14 sm:gap-3">
            <Search className="h-4 w-4 shrink-0 text-slate-500 sm:h-5 sm:w-5" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:truncate placeholder:text-slate-500"
              placeholder="Search 'Green Hydrogen Mission' or 'Article 142'..."
              aria-label="Search current affairs"
            />
            
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-[1fr_1fr_292px]">
          {actionCards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded px-3 py-1 text-xs font-bold tracking-wide ${accentStyles[card.accent]}`}>
                  {card.badge}
                </span>
                <span className="shrink-0 text-sm font-bold text-blue-600">{card.meta}</span>
              </div>
            
              <h3 className="mt-6 line-clamp-2 text-xl font-bold text-slate-900 sm:text-2xl">{card.title}</h3>
              <p className="mt-3 line-clamp-2 max-w-[230px] text-sm leading-6 text-slate-600">{card.subtitle}</p>
              <span
                className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-medium text-blue-600 transition group-hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
              >
                {card.action}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          <article className="rounded-xl border border-slate-300 bg-slate-200/70 p-6 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Your Progress</h3>
              <Sparkles className="h-5 w-5 text-teal-600" />
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
              <span>Daily Goal: 8/10 Articles</span>
              <span className="font-bold text-blue-600">80%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full w-4/5 rounded-full bg-blue-600 transition-all" />
            </div>
            <div className="mt-6 flex items-center justify-between rounded-lg bg-white/70 px-4 py-4">
              <span className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
                <Flame className="h-5 w-5 text-blue-600" />
                14
                <span className="text-xs font-semibold text-slate-600">Day Streak</span>
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Top 5%</span>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-black sm:text-3xl">Today's Current Affairs Feed</h2>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-pressed={activeFilter === 'latest'}
              onClick={() => setActiveFilter('latest')}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                activeFilter === 'latest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Latest
            </button>

            <div className="relative" ref={gsMenuRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isGsMenuOpen}
                onClick={() => setIsGsMenuOpen((open) => !open)}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  activeFilter !== 'latest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                {activeFilter === 'latest' ? 'By GS Paper' : activeFilter}
                <ChevronDown className={`h-3.5 w-3.5 transition ${isGsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isGsMenuOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-soft"
                >
                  {GS_PAPERS.map((paper) => (
                    <button
                      key={paper}
                      type="button"
                      role="option"
                      aria-selected={activeFilter === paper}
                      onClick={() => {
                        setActiveFilter(paper);
                        setIsGsMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm font-medium transition hover:bg-slate-50 ${
                        activeFilter === paper ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      {paper}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-5 sm:space-y-6">
          {affairsArticles.map((article) => (
            <Link
              key={article.id}
              to={`/dashboard/feed/${article.id}`}
              className="group grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:gap-6 sm:p-6 md:grid-cols-[220px_1fr]"
            >
              <div className="aspect-[16/9] w-full overflow-hidden rounded md:aspect-square">
                <img src={article.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          tag === 'Polity' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-teal-700">
                    <Clock3 className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-black sm:mt-4 sm:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 sm:text-base">{article.excerpt}</p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 sm:mt-auto sm:pt-7">
                  <div className="flex items-center gap-5">
                    <span className="inline-flex items-center gap-1.5 rounded transition group-hover:text-blue-600">
                      <NotebookText className="h-4 w-4" />
                      Notes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded transition group-hover:text-blue-600">
                      <Share2 className="h-4 w-4" />
                      Share
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      article.signalTone === 'danger' ? 'text-red-600' : 'text-teal-700'
                    }`}
                  >
                    {article.signalTone === 'success' && <TrendingUp className="h-3.5 w-3.5" />}
                    {article.signal}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="fixed bottom-5 right-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
        aria-label="Open AI assistant"
      >
        <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>
    </main>
  );
};
