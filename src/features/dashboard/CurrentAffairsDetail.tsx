import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  Bookmark,
  CheckCircle2,
  Clock3,
  Download,
  HelpCircle,
  History,
  NotebookText,
  SendHorizontal,
  Share2,
  Sparkles,
  X
} from 'lucide-react';
import { AffairsArticle } from '../../types/dashboard';
import { fetchCurrentAffairsItems, getFallbackArticle, toDashboardArticle } from './currentAffairsApi';

const QUIZ_DURATION_SECONDS = 5 * 60;

const quizQuestions = [
  {
    question:
      "Which of the following statements best describes the concept of the 'Digital Rupee (e-RUPI)' launched by the Reserve Bank of India?",
    context:
      "Consider the nature of CBDC, its issuer, and how it differs from decentralized cryptocurrencies and private payment tokens.",
    answerIndex: 1,
    options: [
      'It is a decentralized cryptocurrency that uses a proof-of-stake consensus mechanism similar to Ethereum.',
      'It is a Central Bank Digital Currency (CBDC) that represents a digital form of fiat money and acts as legal tender.',
      'It is a private digital token issued by commercial banks to facilitate faster UPI transactions without internet.',
      'It is a specialized blockchain asset designed exclusively for cross-border institutional settlements with the IMF.'
    ]
  },
  {
    question: 'Which institution issues the Digital Rupee in India?',
    context: 'Focus on monetary sovereignty and the balance-sheet liability of CBDC.',
    answerIndex: 2,
    options: ['NPCI', 'Ministry of Finance', 'Reserve Bank of India', 'Commercial banks']
  },
  {
    question: 'Why is CBDC important for financial inclusion?',
    context: 'Think about programmable payments, lower cash handling cost, and access to digital value transfer.',
    answerIndex: 0,
    options: [
      'It can enable low-cost digital payments and targeted delivery of benefits.',
      'It removes the need for all monetary policy decisions.',
      'It replaces the Constitutionally mandated role of Parliament.',
      'It is only usable for international trade settlements.'
    ]
  },
  {
    question: 'CBDC differs from private cryptocurrency mainly because it is:',
    context: 'UPSC often tests the difference between sovereign digital currency and decentralized crypto assets.',
    answerIndex: 3,
    options: [
      'Mined by private validators',
      'Unaffected by central bank regulation',
      'Always anonymous and outside audit trails',
      'Issued and backed by the central bank'
    ]
  }
];

const continueLearning = [
  {
    title: 'Evolution of Monetary Policy in Post-Liberalized India',
    category: 'Economy',
    image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=640&q=80'
  },
  {
    title: 'FinTech Regulations: Balancing Innovation and Stability',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80'
  }
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizModal = ({ isOpen, onClose }: QuizModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentIndex(0);
    setSelectedOption(null);
    setCorrectCount(0);
    setAnsweredCount(0);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setIsFinished(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isFinished) return;

    const timer = window.setInterval(() => {
      setTimeLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished, isOpen]);

  if (!isOpen) return null;

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((QUIZ_DURATION_SECONDS - timeLeft) / QUIZ_DURATION_SECONDS) * 100;
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;

  const submitAnswer = () => {
    if (selectedOption === null) return;

    setAnsweredCount((count) => count + 1);
    if (selectedOption === currentQuestion.answerIndex) {
      setCorrectCount((count) => count + 1);
    }

    if (currentIndex === quizQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedOption(null);
  };

  const skipQuestion = () => {
    if (currentIndex === quizQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedOption(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F4F6] text-slate-900">
      <div className="flex h-[70px] items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-black">CivilServe AI</h2>
          <span className="h-6 w-px bg-slate-200" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">UPSC Daily Quiz</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">Time Remaining</p>
            <p className="font-semibold text-blue-600">{formatTime(timeLeft)}</p>
          </div>
          <button type="button" className="rounded-lg p-2 transition hover:bg-slate-100" onClick={onClose} aria-label="Close quiz">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="h-1 bg-slate-200">
        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto grid max-h-[calc(100vh-74px)] max-w-[1180px] gap-6 overflow-y-auto px-5 py-8 lg:grid-cols-[1fr_386px]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {isFinished ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="mt-6 text-3xl font-black text-slate-950">Quiz Completed</h3>
              <p className="mt-3 max-w-md text-slate-600">
                You answered {correctCount} out of {quizQuestions.length} questions correctly.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-100 px-8 py-5">
                  <p className="text-3xl font-black text-slate-950">{correctCount}/{quizQuestions.length}</p>
                  <p className="text-sm text-slate-600">Correct Answers</p>
                </div>
                <div className="rounded-xl bg-slate-100 px-8 py-5">
                  <p className="text-3xl font-black text-slate-950">{accuracy}%</p>
                  <p className="text-sm text-slate-600">Accuracy</p>
                </div>
              </div>
              <button type="button" className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700" onClick={onClose}>
                Back to Article
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-100 px-3 py-1.5 text-sm font-semibold text-teal-700">GS-III: Economy</span>
                <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">High Importance</span>
              </div>

              <p className="mt-5 text-base leading-7 text-slate-900">
                Question {currentIndex + 1}: {currentQuestion.question}
              </p>

              <div className="mt-4 rounded-xl border-l-4 border-blue-400 bg-slate-100 p-4 text-sm leading-6 text-slate-700">
                {currentQuestion.context}
              </div>

              <div className="mt-8 space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer gap-4 rounded-xl border p-5 transition ${
                      selectedOption === index ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      className="mt-1 h-5 w-5"
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-slate-500">Option {String.fromCharCode(65 + index)}</span>
                      <span className="mt-2 block leading-7">{option}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" className="rounded-xl px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-100" onClick={skipQuestion}>
                  Skip Question
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700">
                    <Bookmark className="h-4 w-4" />
                    Save for Later
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-soft transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={submitAnswer}
                    disabled={selectedOption === null}
                  >
                    Submit Answer
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-600">
              <HelpCircle className="h-5 w-5" />
              Quick Reference
            </h3>
            <div className="mt-5 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h4 className="font-semibold">Syllabus Linkage</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                General Studies III: Indian Economy and issues relating to planning, mobilization of resources, growth,
                development and employment.
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h4 className="font-semibold">What is CBDC?</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Central Bank Digital Currency is legal tender issued by a central bank in digital form and exchangeable
                one-to-one with fiat currency.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600">Legal Tender</span>
                <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600">RBI Act 1934</span>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-600 p-5 text-white">
              <h4 className="flex items-center gap-2 font-bold">
                <Brain className="h-4 w-4" />
                AI Strategy Tip
              </h4>
              <p className="mt-4 text-sm leading-7 text-blue-50">
                UPSC often asks about the nature of issuance. CBDC is a direct liability of the RBI, whereas UPI
                transactions involve commercial bank liabilities.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-black uppercase text-slate-700">Quiz Statistics</h3>
            <div className="mt-5 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-black">{accuracy}%</p>
                <p className="text-sm text-slate-600">Avg. Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-black text-teal-600">{answeredCount}/{quizQuestions.length}</p>
                <p className="text-sm text-slate-600">Questions Done</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export const CurrentAffairsDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState<AffairsArticle | null>(() => getFallbackArticle(articleId));
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;

      setIsLoadingArticle(true);
      setArticleError('');

      try {
        const items = await fetchCurrentAffairsItems();
        const match = items.find((item) => item.id === articleId || item.article?.id === articleId);
        setArticle(match ? toDashboardArticle(match) : getFallbackArticle(articleId));
      } catch (error) {
        setArticleError('Showing saved article while the live feed is unavailable.');
        setArticle(getFallbackArticle(articleId));
      } finally {
        setIsLoadingArticle(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (!article && !isLoadingArticle) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#F2F4F6] px-5 py-6 text-slate-900 lg:px-10">
        <div className="mx-auto max-w-[1180px] rounded-xl bg-white p-8 text-slate-500 shadow-soft">
          Loading article...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2F4F6] px-5 py-6 text-slate-900 lg:px-10">
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[1fr_330px]">
        <article className="min-w-0">
          <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                {tag}
              </span>
            ))}
            {article.importance && (
              <span className="rounded-full bg-teal-300 px-3 py-1.5 text-xs font-bold text-teal-900">{article.importance}</span>
            )}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">{article.title}</h1>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-300 py-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <img src={article.image} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p>
                  By <span className="font-semibold text-slate-900">{article.author}</span>
                </p>
                <p>{article.authorRole} • {article.publishedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {article.readTime}
              </span>
              <button type="button" className="rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:bg-white" aria-label="Download">
                <Download className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg border border-slate-300 p-2 text-slate-700 transition hover:bg-white" aria-label="Share">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <section className="mt-8 overflow-hidden rounded-xl bg-white p-6 text-center text-slate-950 shadow-soft">
            {articleError && <p className="mb-4 text-sm font-medium text-amber-700">{articleError}</p>}
            {isLoadingArticle && <p className="mb-4 text-sm text-slate-500">Refreshing live article...</p>}
            <p className="text-lg font-black tracking-wide">UPSC CURRENT AFFAIRS UPDATE</p>
            <p className="text-xs font-semibold text-slate-500">{article.heroLabel}</p>
            <div className="mx-auto mt-5 max-w-[520px] overflow-hidden rounded-lg bg-slate-950">
              <img src={article.image} alt="" className="h-64 w-full object-cover opacity-90" />
            </div>
          </section>

          <section className="mt-8 rounded-xl bg-white p-7 text-slate-700 shadow-soft">
            <div className="rounded-lg border-l-4 border-blue-600 bg-slate-100 p-5">
              <p className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Key Takeaways
              </p>
              <ul className="space-y-3 text-sm leading-6">
                {article.takeaways?.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="mt-8 text-2xl font-black text-slate-900">1. Exam Relevance</h2>
            <p className="mt-4 leading-7">
              For UPSC aspirants, this topic spans across Prelims and Mains. Understanding the core concept, policy
              context, and institutional implications is crucial for answering questions on governance, economy, and
              public policy.
            </p>

            <div className="mt-5 rounded-lg border border-slate-200 p-5">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Prelims Focused Points</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {article.prelimsPoints?.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-lg bg-slate-100 p-4 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-black text-slate-900">2. Mains Analysis</h2>
            <div className="mt-4 space-y-5 leading-7">
              {article.mainsAnalysis?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            {article.quote && (
              <blockquote className="mt-7 border-l-4 border-slate-400 bg-slate-50 p-5 font-semibold text-slate-600">
                "{article.quote}"
              </blockquote>
            )}

            <h2 className="mt-8 text-2xl font-black text-slate-900">3. PYQ References</h2>
            <div className="mt-4 rounded-lg border border-dashed border-slate-400 p-4">
              <p className="mb-2 flex items-center gap-2 font-semibold">
                <History className="h-4 w-4" />
                Mains 2022 Question
              </p>
              <p className="italic leading-7">"{article.pyqReference}"</p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-sm font-bold text-slate-500">Continue Learning</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {continueLearning.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-lg bg-white text-slate-900">
                  <img src={item.image} alt="" className="h-32 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-bold text-blue-600">{item.category}</p>
                    <h3 className="mt-2 font-semibold leading-6">{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-xl bg-white p-5 text-slate-700 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Ask CivilServe AI</h2>
                <p className="text-[10px] font-bold uppercase text-slate-500">Powered by Claude 3.5</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6">Confused about CBDC vs UPI? Ask me to explain the difference in 2 minutes.</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <input className="min-w-0 flex-1 text-sm outline-none" placeholder="Type your doubt here..." />
              <button type="button" className="rounded-lg bg-blue-600 p-2 text-white" aria-label="Send question">
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold">Explain Wholesale CBDC</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold">Impact on Inflation?</span>
            </div>
          </section>

          <section className="rounded-xl bg-white p-5 text-slate-800 shadow-soft">
            <h2 className="font-bold">Study Toolkit</h2>
            <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4" />
              Generate AI Smart Notes
            </button>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold transition hover:bg-slate-50"
              onClick={() => setIsQuizOpen(true)}
            >
              <NotebookText className="h-4 w-4" />
              Take a 5-Min Quiz
            </button>
          </section>

          <section className="rounded-xl bg-white p-5 text-slate-800 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Daily Goal</h2>
              <span className="font-black text-blue-600">85%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[85%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Finish reading 2 more articles to complete your GS-III target for today.</p>
          </section>

          <nav className="hidden border-l border-slate-300 pl-4 text-sm font-bold text-slate-500 lg:block">
            <p className="mb-4 uppercase text-slate-600">Table of Contents</p>
            {['Hero', 'Exam Relevance', 'Prelims Highlights', 'Mains Analysis', 'PYQ Reference'].map((item, index) => (
              <a key={item} href="#" className={`mb-4 block ${index === 0 ? 'text-blue-600' : 'hover:text-slate-950'}`}>
                {item}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
};