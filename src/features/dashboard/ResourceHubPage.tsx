import { Navigate, useParams } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock3, FileText, PenLine } from 'lucide-react';
import { resourceNavItems } from './dashboardContent';

const resourceDetails = {
  'gs-papers': {
    title: 'GS Papers',
    description: 'Organized General Studies resources for quick revision and syllabus-linked practice.',
    cards: ['GS-I: History and Society', 'GS-II: Polity and Governance', 'GS-III: Economy and Security', 'GS-IV: Ethics']
  },
  'prelims-mcqs': {
    title: 'Prelims MCQs',
    description: 'Daily objective questions mapped to current affairs and static syllabus anchors.',
    cards: ['Economy Practice Set', 'Polity Quick Drill', 'Environment PYQ Mix', 'Science and Tech Revision']
  },
  'mains-writing': {
    title: 'Mains Writing',
    description: 'Answer-writing prompts with structure cues, value points, and evaluation checkpoints.',
    cards: ['250-word Practice', 'Intro and Conclusion Bank', 'Case Study Practice', 'Model Answer Review']
  },
  syllabus: {
    title: 'Syllabus',
    description: 'Browse the UPSC CSE syllabus as connected, study-ready blocks.',
    cards: ['Prelims Syllabus', 'Mains GS Syllabus', 'Essay Themes', 'Optional Planning']
  },
  pyqs: {
    title: 'PYQs',
    description: 'Previous year questions grouped by paper, theme, and recurring demand.',
    cards: ['Prelims 2024', 'Mains 2023', 'Topic-wise PYQs', 'Trend Analysis']
  }
};

export const ResourceHubPage = () => {
  const { resourceId } = useParams();
  const selectedResource = resourceId ? resourceDetails[resourceId as keyof typeof resourceDetails] : null;

  if (!selectedResource) {
    return <Navigate to="/dashboard/resources/prelims-mcqs" replace />;
  }

  const navItem = resourceNavItems.find((item) => item.path.endsWith(resourceId ?? ''));

  return (
    <main className="min-h-screen bg-[#E6E8EA] px-5 py-8 text-slate-950 lg:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Resource Hub</p>
              <h1 className="mt-2 text-3xl font-black">{selectedResource.title}</h1>
              <p className="mt-3 max-w-2xl text-slate-600">{selectedResource.description}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
              <BookOpen className="h-4 w-4" />
              {navItem?.label}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {selectedResource.cards.map((card, index) => (
            <article key={card} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
                {index % 3 === 0 ? <FileText className="h-5 w-5" /> : index % 3 === 1 ? <PenLine className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <h2 className="mt-5 text-lg font-black">{card}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Practice, revise, and track progress for this module.</p>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock3 className="h-4 w-4" />
                12 min module
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
