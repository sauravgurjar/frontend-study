import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Search,
  Sparkles,
  TimerReset,
  ListFilter,
  BookMarked
} from 'lucide-react';
import { axiosInstance } from '../../api/axios';

const gsFilters = ['All', 'GS-I', 'GS-II', 'GS-III', 'GS-IV', 'Essay'] as const;
const sourceFilters = ['All Sources', 'The Hindu', 'PIB', 'Daily Digest'] as const;
const importanceFilters = ['Any Importance', 'High Importance', 'Medium Importance', 'Low Importance'] as const;

type GsFilter = (typeof gsFilters)[number];
type GsPaper = Exclude<GsFilter, 'All'>;
type SourceFilter = (typeof sourceFilters)[number];
type Source = Exclude<SourceFilter, 'All Sources'>;
type ImportanceFilter = (typeof importanceFilters)[number];
type Importance = Exclude<ImportanceFilter, 'Any Importance'>;

interface FeedItem {
  id: string;
  date: string;
  groupTitle: string;
  gsPaper: GsPaper;
  importance: Importance;
  source: Source;
  time: string;
  readTime: string;
  title: string;
  description: string;
  image?: string;
  summary?: boolean;
  digest?: boolean;
}

interface FeedItemsResponse {
  success?: boolean;
  data?: RawFeedItem[];
  feedItems?: RawFeedItem[];
}

interface RawFeedItem {
  id?: string | number;
  _id?: string | number;
  date?: string;
  publishedAt?: string;
  createdAt?: string;
  groupTitle?: string;
  group_title?: string;
  gsPaper?: string;
  gs_paper?: string;
  paper?: string;
  importance?: string;
  source?: string;
  time?: string;
  readTime?: string;
  read_time?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  summary?: boolean;
  hasSummary?: boolean;
  digest?: boolean;
}

// Color system: each GS paper and importance level gets a fixed identity
// so the same topic always reads the same color across the app.
const gsPaperStyles: Record<GsPaper, { badge: string; bar: string; dot: string }> = {
  'GS-I': { badge: 'bg-violet-50 text-violet-700', bar: 'bg-violet-500', dot: 'bg-violet-500' },
  'GS-II': { badge: 'bg-blue-50 text-blue-700', bar: 'bg-blue-500', dot: 'bg-blue-500' },
  'GS-III': { badge: 'bg-teal-50 text-teal-700', bar: 'bg-teal-500', dot: 'bg-teal-500' },
  'GS-IV': { badge: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  Essay: { badge: 'bg-rose-50 text-rose-700', bar: 'bg-rose-500', dot: 'bg-rose-500' }
};

const importanceStyles: Record<Importance, { text: string; badge: string }> = {
  'High Importance': { text: 'text-red-600', badge: 'bg-red-50 text-red-600' },
  'Medium Importance': { text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600' },
  'Low Importance': { text: 'text-slate-400', badge: 'bg-slate-100 text-slate-500' }
};

const toDateOnly = (value?: string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.includes('T') ? value.slice(0, 10) : value;
};

const toGroupTitle = (date: string, fallback?: string) => {
  if (fallback) return fallback;

  const today = new Date();
  const parsedDate = new Date(`${date}T00:00:00`);
  const diffDays = Math.round((today.setHours(0, 0, 0, 0) - parsedDate.getTime()) / 86400000);
  const label = parsedDate.toLocaleDateString('en', { month: 'short', day: 'numeric' });

  if (diffDays === 0) return `Today, ${label}`;
  if (diffDays === 1) return `Yesterday, ${label}`;
  return label;
};

const normalizeGsPaper = (value?: string): GsPaper => {
  if (value === 'GS-I' || value === 'GS-II' || value === 'GS-III' || value === 'GS-IV' || value === 'Essay') {
    return value;
  }
  return 'GS-III';
};

const normalizeSource = (value?: string): Source => {
  if (value === 'The Hindu' || value === 'PIB' || value === 'Daily Digest') {
    return value;
  }
  return 'The Hindu';
};

const normalizeImportance = (value?: string): Importance => {
  if (value === 'High Importance' || value === 'Medium Importance' || value === 'Low Importance') {
    return value;
  }
  return 'Medium Importance';
};

const normalizeFeedItem = (item: RawFeedItem, index: number): FeedItem => {
  const date = toDateOnly(item.date || item.publishedAt || item.createdAt);

  return {
    id: String(item.id || item._id || `feed-${index}`),
    date,
    groupTitle: toGroupTitle(date, item.groupTitle || item.group_title),
    gsPaper: normalizeGsPaper(item.gsPaper || item.gs_paper || item.paper),
    importance: normalizeImportance(item.importance),
    source: normalizeSource(item.source),
    time: item.time || '09:00 AM',
    readTime: item.readTime || item.read_time || '5 min read',
    title: item.title || 'Untitled current affairs item',
    description: item.description || item.excerpt || '',
    image: item.image || item.imageUrl || item.image_url,
    summary: item.summary || item.hasSummary,
    digest: item.digest
  };
};

const extractFeedItems = (response: RawFeedItem[] | FeedItemsResponse): RawFeedItem[] => {
  if (Array.isArray(response)) return response;
  return response.data || response.feedItems || [];
};

const earlierItems = [
  {
    label: 'Weekly Map Marker',
    title: 'Sudan Crisis & Operation Kaveri',
    description: 'Evacuation efforts and geopolitical implications for India in the Horn of Africa.',
    action: 'Open Map Studio'
  },
  {
    label: 'Scheme Spotlight',
    title: 'PM-MITRA Parks',
    description: '7 states identified for Textile Parks to boost manufacturing & exports.',
    action: 'Download Infographic'
  }
];

export const DailyCAPage = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedGs, setSelectedGs] = useState<GsFilter>('All');
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('All Sources');
  const [selectedImportance, setSelectedImportance] = useState<ImportanceFilter>('Any Importance');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFeedItems = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const params: Record<string, string> = {};
        if (selectedGs !== 'All') params.gsPaper = selectedGs;
        if (selectedImportance !== 'Any Importance') params.importance = selectedImportance;

        const response = await axiosInstance.get<RawFeedItem[] | FeedItemsResponse>('/feed-items', { params });
        const items = extractFeedItems(response.data).map(normalizeFeedItem);
        setFeedItems(items);
      } catch (error) {
        setLoadError('Unable to load live feed.');
        setFeedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedItems();
  }, [selectedGs, selectedImportance]);

  const filteredItems = useMemo(
    () =>
      feedItems.filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSource = selectedSource === 'All Sources' || item.source === selectedSource;
        const matchesDate = !selectedDate || item.date === selectedDate;

        return matchesSearch && matchesSource && matchesDate;
      }),
    [feedItems, searchTerm, selectedDate, selectedSource]
  );

  const groupedItems = filteredItems.reduce<Record<string, FeedItem[]>>((groups, item) => {
    groups[item.groupTitle] = [...(groups[item.groupTitle] || []), item];
    return groups;
  }, {});

  // Stats for the sidebar: distribution across GS papers within the current filtered set.
  const gsPaperCounts = useMemo(() => {
    const counts: Record<GsPaper, number> = {
      'GS-I': 0,
      'GS-II': 0,
      'GS-III': 0,
      'GS-IV': 0,
      Essay: 0
    };
    filteredItems.forEach((item) => {
      counts[item.gsPaper] += 1;
    });
    return counts;
  }, [filteredItems]);

  const maxGsCount = Math.max(1, ...Object.values(gsPaperCounts));
  const highImportanceCount = filteredItems.filter((item) => item.importance === 'High Importance').length;

  const hasActiveFilters =
    selectedGs !== 'All' || selectedSource !== 'All Sources' || selectedImportance !== 'Any Importance' || !!selectedDate;

  const resetFilters = () => {
    setSelectedGs('All');
    setSelectedSource('All Sources');
    setSelectedImportance('Any Importance');
    setSelectedDate('');
    setSearchTerm('');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 lg:px-10">
        {/* Left sidebar: search + filters + live stats, sticky on scroll */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-8 space-y-5">
            <div>
              <h1 className="text-2xl font-bold">Current Affairs</h1>
              <p className="mt-1 text-sm text-slate-500">Daily UPSC-relevant briefings</p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <ListFilter className="h-3.5 w-3.5" />
                  Filters
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <p className="mb-1.5 text-xs font-medium text-slate-400">GS Paper</p>
                {gsFilters.map((filter) => {
                  const isActive = selectedGs === filter;
                  const dotColor = filter === 'All' ? 'bg-slate-400' : gsPaperStyles[filter].dot;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedGs(filter)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition ${
                        isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : dotColor}`} />
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="block text-xs font-medium text-slate-400">Source</label>
                <span className="relative mt-1.5 flex items-center">
                  <select
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-sm font-medium text-slate-800 outline-none"
                    value={selectedSource}
                    onChange={(event) => setSelectedSource(event.target.value as SourceFilter)}
                  >
                    {sourceFilters.map((source) => (
                      <option key={source}>{source}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-400">Importance</label>
                <span className="relative mt-1.5 flex items-center">
                  <select
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-sm font-medium text-slate-800 outline-none"
                    value={selectedImportance}
                    onChange={(event) => setSelectedImportance(event.target.value as ImportanceFilter)}
                  >
                    {importanceFilters.map((importance) => (
                      <option key={importance}>{importance}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
                </span>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-400">Date</label>
                <input
                  type="date"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-800 outline-none"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>
            </div>

            {/* Live stats derived from the currently filtered set */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <BookMarked className="h-3.5 w-3.5" />
                  Snapshot
                </span>
                <span className="text-xs font-semibold text-slate-400">{filteredItems.length} items</span>
              </div>

              <div className="space-y-2">
                {gsFilters
                  .filter((filter): filter is GsPaper => filter !== 'All')
                  .map((paper) => (
                    <div key={paper} className="flex items-center gap-2">
                      <span className="w-12 text-xs font-medium text-slate-500">{paper}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${gsPaperStyles[paper].bar}`}
                          style={{ width: `${(gsPaperCounts[paper] / maxGsCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-4 text-right text-xs font-semibold text-slate-500">{gsPaperCounts[paper]}</span>
                    </div>
                  ))}
              </div>

              {highImportanceCount > 0 && (
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600">
                  {highImportanceCount} high-importance item{highImportanceCount === 1 ? '' : 's'} today
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Main feed */}
        <section className="min-w-0 flex-1">
          {/* Mobile-only search + GS filter row, since sidebar is hidden below lg */}
          <div className="mb-5 space-y-3 lg:hidden">
            <h1 className="text-2xl font-bold">Current Affairs</h1>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search news, topics, GS syllabus..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {gsFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedGs(filter)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    selectedGs === filter ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading && <p className="mb-3 text-sm text-slate-500">Loading live feed...</p>}
          {loadError && !isLoading && (
            <p className="mb-3 text-sm font-medium text-amber-700">{loadError}</p>
          )}

          <div className="space-y-7">
            {Object.keys(groupedItems).length === 0 && !isLoading && (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No current affairs match this filter.
              </div>
            )}

            {Object.entries(groupedItems).map(([groupTitle, items]) => (
              <section key={groupTitle}>
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-white px-4 py-2.5 shadow-sm">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${
                      groupTitle.startsWith('Today') ? 'bg-blue-600' : 'bg-slate-400'
                    }`}
                  >
                    {groupTitle.startsWith('Today') ? (
                      <CalendarDays className="h-3.5 w-3.5" />
                    ) : (
                      <TimerReset className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <h2 className="text-xl font-bold">{groupTitle}</h2>
                </div>

                <div className="space-y-4">
                  {items.map((item) =>
                    item.digest ? (
                      <article
                        key={item.id}
                        className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-6 shadow-sm"
                      >
                        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                          <Sparkles className="h-4 w-4" />
                          {item.time}
                        </p>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-2 max-w-2xl leading-6 text-slate-600">{item.description}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                          >
                            View Linked Editorials
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                          >
                            Add to Mains Drafts
                          </button>
                        </div>
                      </article>
                    ) : (
                      <article
                        key={item.id}
                        className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex gap-5">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                              <span className={`rounded-md px-2 py-1 ${gsPaperStyles[item.gsPaper].badge}`}>
                                {item.gsPaper}
                              </span>
                              <span className={`rounded-md px-2 py-1 ${importanceStyles[item.importance].badge}`}>
                                {item.importance}
                              </span>
                              <span className="ml-auto text-slate-400">{item.time}</span>
                            </div>
                            <h3 className="mt-2.5 text-lg font-bold leading-snug">{item.title}</h3>
                            <p className="mt-1.5 leading-6 text-slate-500">{item.description}</p>
                            <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                {item.source}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {item.readTime}
                              </span>
                              {item.summary && (
                                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-blue-600">
                                  AI Summary <Sparkles className="h-3.5 w-3.5" />
                                </span>
                              )}
                            </div>
                          </div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="hidden h-24 w-32 shrink-0 rounded-lg object-cover sm:block"
                            />
                          )}
                        </div>
                      </article>
                    )
                  )}
                </div>
              </section>
            ))}

            <section>
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-white px-4 py-2.5 shadow-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-white">
                  <TimerReset className="h-3.5 w-3.5" />
                </span>
                <h2 className="text-xl font-bold">Earlier This Week</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {earlierItems.map((item) => (
                  <article key={item.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                      {item.label}
                    </span>
                    <h3 className="mt-3.5 font-bold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
                    <button type="button" className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      {item.action}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DailyCAPage;