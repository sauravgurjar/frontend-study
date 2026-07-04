import { Navigate, useParams } from 'react-router-dom';
import { Newspaper, Radio } from 'lucide-react';

const topNavPages = {
  editorials: {
    title: 'Editorials',
    eyebrow: 'Opinion Analysis',
    description: 'Editorial summaries with balanced viewpoints, examples, and mains-ready points.',
    items: ['The Hindu editorials', 'Indian Express explainers', 'Pros and cons bank', 'Mains answer hooks'],
    icon: Newspaper
  },
  pib: {
    title: 'PIB',
    eyebrow: 'Government Updates',
    description: 'Important PIB releases distilled into syllabus-linked notes and prelims facts.',
    items: ['Scheme updates', 'Ministry releases', 'Facts for prelims', 'Governance examples'],
    icon: Radio
  }
};

export const TopNavPage = () => {
  const { sectionId } = useParams();
  const page = sectionId ? topNavPages[sectionId as keyof typeof topNavPages] : null;

  if (!page) {
    return <Navigate to="/dashboard" replace />;
  }

  const Icon = page.icon;

  return (
    <main className="min-h-screen bg-[#E6E8EA] px-5 py-8 text-slate-950 lg:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">{page.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-black">{page.title}</h1>
              <p className="mt-3 max-w-2xl text-slate-600">{page.description}</p>
            </div>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon className="h-7 w-7" />
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {page.items.map((item) => (
            <article key={item} className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Curated study material for faster reading, revision, and answer-writing recall.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
