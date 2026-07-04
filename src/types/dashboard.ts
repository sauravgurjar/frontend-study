export interface ResourceNavItem {
  label: string;
  icon: 'papers' | 'mcq' | 'writing' | 'syllabus' | 'pyq';
  path: string;
  active?: boolean;
}

export interface ActionCard {
  title: string;
  subtitle: string;
  badge: string;
  meta: string;
  action: string;
  accent: 'blue' | 'teal';
  path: string;
}

export interface AffairsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  readTime: string;
  signal: string;
  signalTone: 'danger' | 'success';
  importance?: string;
  author?: string;
  authorRole?: string;
  publishedAt?: string;
  heroLabel?: string;
  takeaways?: string[];
  prelimsPoints?: string[];
  mainsAnalysis?: string[];
  quote?: string;
  pyqReference?: string;
  aiSuggestions?: string[];
  studyGoal?: {
    message: string;
    progress: number;
  };
  content?: string;
}

export type GsPaper = 'GS-I' | 'GS-II' | 'GS-III' | 'GS-IV' | 'Essay';
export type Source = 'The Hindu' | 'PIB' | 'Daily Digest';
export type Importance = 'High Importance' | 'Medium Importance' | 'Low Importance';

export interface CurrentAffairsFeedItem {
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
  article?: AffairsArticle | null;
}
