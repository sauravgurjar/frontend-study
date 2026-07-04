import { axiosInstance } from '../../api/axios';
import { affairsArticles } from './dashboardContent';
import { AffairsArticle, CurrentAffairsFeedItem, GsPaper, Importance, Source } from '../../types/dashboard';

export const currentAffairsFallbackImage =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80';

interface FeedItemsResponse {
  success?: boolean;
  data?: RawFeedItem[];
  feedItems?: RawFeedItem[];
}

interface RawArticle {
  id?: string | number;
  title?: string;
  excerpt?: string;
  description?: string;
  heroLabel?: string;
  author?: string;
  authorRole?: string;
  publishedAt?: string;
  readTime?: string;
  importance?: string;
  image?: string | null;
  tags?: string[];
  takeaways?: string[];
  prelimsPoints?: string[];
  mainsAnalysis?: string[];
  quote?: string;
  pyqReference?: string;
  aiSuggestions?: string[];
  studyGoal?: {
    message?: string;
    progress?: number;
  };
  content?: string;
}

export interface RawFeedItem {
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
  image?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  summary?: boolean;
  hasSummary?: boolean;
  digest?: boolean;
  article?: RawArticle | null;
}

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

const normalizeTags = (tags: string[] | undefined, gsPaper: GsPaper) => {
  const nextTags = tags?.length ? tags : [gsPaper, 'UPSC'];
  return Array.from(new Set(nextTags));
};

const normalizeArticle = (
  article: RawArticle | undefined | null,
  feedItem: Pick<CurrentAffairsFeedItem, 'id' | 'title' | 'description' | 'image' | 'gsPaper' | 'importance' | 'readTime'>
): AffairsArticle | null => {
  if (!article) return null;

  return {
    id: String(article.id || feedItem.id),
    title: article.title || feedItem.title,
    excerpt: article.excerpt || article.description || feedItem.description,
    image: article.image || feedItem.image || currentAffairsFallbackImage,
    tags: normalizeTags(article.tags, feedItem.gsPaper),
    readTime: article.readTime || feedItem.readTime,
    signal: feedItem.importance === 'High Importance' ? '! High Yield' : 'Exam Relevant',
    signalTone: feedItem.importance === 'High Importance' ? 'danger' : 'success',
    importance: article.importance || feedItem.importance,
    author: article.author || 'CivilServe Editorial Desk',
    authorRole: article.authorRole || 'Current Affairs Team',
    publishedAt: article.publishedAt,
    heroLabel: article.heroLabel || 'UPSC Current Affairs Analysis',
    takeaways: article.takeaways || [],
    prelimsPoints: article.prelimsPoints || [],
    mainsAnalysis: article.mainsAnalysis || [],
    quote: article.quote,
    pyqReference: article.pyqReference,
    aiSuggestions: article.aiSuggestions || [],
    studyGoal: {
      message: article.studyGoal?.message || 'Continue with one related current affairs article.',
      progress: article.studyGoal?.progress ?? 80
    },
    content: article.content || ''
  };
};

export const normalizeFeedItem = (item: RawFeedItem, index: number): CurrentAffairsFeedItem => {
  const date = toDateOnly(item.date || item.publishedAt || item.createdAt);
  const gsPaper = normalizeGsPaper(item.gsPaper || item.gs_paper || item.paper);
  const importance = normalizeImportance(item.importance);
  const image = item.image || item.imageUrl || item.image_url || undefined;
  const feedItem: CurrentAffairsFeedItem = {
    id: String(item.id || item._id || `feed-${index}`),
    date,
    groupTitle: toGroupTitle(date, item.groupTitle || item.group_title),
    gsPaper,
    importance,
    source: normalizeSource(item.source),
    time: item.time || '09:00 AM',
    readTime: item.readTime || item.read_time || '5 min read',
    title: item.title || 'Untitled current affairs item',
    description: item.description || item.excerpt || '',
    image,
    summary: item.summary || item.hasSummary,
    digest: item.digest
  };

  return {
    ...feedItem,
    article: normalizeArticle(item.article, feedItem)
  };
};

const extractFeedItems = (response: RawFeedItem[] | FeedItemsResponse): RawFeedItem[] => {
  if (Array.isArray(response)) return response;
  return response.data || response.feedItems || [];
};

export const fetchCurrentAffairsItems = async (params: Record<string, string> = {}) => {
  const response = await axiosInstance.get<RawFeedItem[] | FeedItemsResponse>('/feed-items', { params });
  return extractFeedItems(response.data).map(normalizeFeedItem);
};

export const getFallbackArticle = (articleId?: string) => {
  return affairsArticles.find((article) => article.id === articleId) || null;
};

export const toDashboardArticle = (item: CurrentAffairsFeedItem): AffairsArticle => {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.description,
    image: item.image || currentAffairsFallbackImage,
    tags: [item.gsPaper, item.source],
    readTime: item.readTime,
    signal: item.importance === 'High Importance' ? '! High Yield' : 'Exam Relevant',
    signalTone: item.importance === 'High Importance' ? 'danger' : 'success',
    importance: item.importance,
    author: 'CivilServe Editorial Desk',
    authorRole: 'Current Affairs Team',
    publishedAt: item.date,
    heroLabel: item.source
  };
};
