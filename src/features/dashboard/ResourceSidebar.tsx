import { Link, NavLink } from 'react-router-dom';
import { ClipboardList, FileText, History, ListChecks, LucideIcon, PenLine, X } from 'lucide-react';
import { ResourceNavItem } from '../../types/dashboard';

const navIcons: Record<ResourceNavItem['icon'], LucideIcon> = {
  papers: FileText,
  mcq: ListChecks,
  writing: PenLine,
  syllabus: ClipboardList,
  pyq: History
};

interface ResourceSidebarProps {
  items: ResourceNavItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface ResourceHubContentProps {
  items: ResourceNavItem[];
  onClose: () => void;
  showCloseButton?: boolean;
}

const ResourceHubContent = ({ items, onClose, showCloseButton = false }: ResourceHubContentProps) => (
  <>
    <div className={`flex items-center justify-end px-4 ${showCloseButton ? 'py-4' : 'pt-4'}`}>
      {showCloseButton && (
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          onClick={onClose}
          aria-label="Close Resource Hub"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    <nav className="space-y-2 px-4 py-6">
      {items.map((item) => {
        const Icon = navIcons[item.icon];
        if (!Icon) return null;

        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                isActive || item.active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            }
            onClick={onClose}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <div className="mt-auto p-4">
      <div className="rounded-xl bg-black p-4 text-white">
        <p className="text-sm leading-6">Master the syllabus with AI-guided practice sets.</p>
        <Link
          to="/dashboard/resources/prelims-mcqs"
          className="mt-3 block w-full rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-black"
          onClick={onClose}
        >
          Start Practice
        </Link>
      </div>
    </div>
  </>
);

export const ResourceSidebar = ({ items, isOpen, onClose }: ResourceSidebarProps) => (
  <>
    <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <ResourceHubContent items={items} onClose={onClose} />
    </aside>

    {isOpen && (
      <div className="fixed inset-0 z-50 md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-slate-950/40"
          onClick={onClose}
          aria-label="Close Resource Hub overlay"
        />
        <aside className="relative flex h-full w-[280px] max-w-[86vw] flex-col border-r border-slate-200 bg-white shadow-soft">
          <ResourceHubContent items={items} onClose={onClose} showCloseButton />
        </aside>
      </div>
    )}
  </>
);
