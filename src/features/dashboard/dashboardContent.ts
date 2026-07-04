import { ActionCard, AffairsArticle, ResourceNavItem } from '../../types/dashboard';

export const resourceNavItems: ResourceNavItem[] = [
  { label: 'GS Papers', icon: 'papers', path: '/dashboard/resources/gs-papers' },
  { label: 'Prelims MCQs', icon: 'mcq', path: '/dashboard/resources/prelims-mcqs' },
  { label: 'Mains Writing', icon: 'writing', path: '/dashboard/resources/mains-writing' },
  { label: 'Syllabus', icon: 'syllabus', path: '/dashboard/resources/syllabus' },
  { label: 'PYQs', icon: 'pyq', path: '/dashboard/resources/pyqs' }
];

export const actionCards: ActionCard[] = [
  {
    title: "Today's CA",
    subtitle: 'Real-time breakdown of critical events from 05 Oct 2024.',
    badge: 'LIVE',
    meta: '12 Updates',
    action: 'Open Dashboard',
    accent: 'blue',
    path: '/dashboard/daily-ca'
  },
  {
    title: 'Editorial Summary',
    subtitle: 'Concise multi-perspective analysis for Mains answer writing.',
    badge: 'ANALYSIS',
    meta: '3 Summaries',
    action: 'View Editorials',
    accent: 'teal',
    path: '/dashboard/editorials'
  }
];

export const affairsArticles: AffairsArticle[] = [
  {
    id: 'green-hydrogen',
    title: 'Digital Rupee and the Future of Sovereign Currency in India',
    excerpt:
      'Central Bank Digital Currency (CBDC) aims to provide a safe digital alternative to physical cash while improving financial inclusion, programmable payments, and monetary policy transmission.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
    tags: ['GS-III', 'Economy'],
    readTime: '15 min read',
    signal: '! High Yield',
    signalTone: 'danger',
    importance: 'High Importance',
    author: 'Dr. Ananya Sharma',
    authorRole: 'Lead Macroeconomics Analyst',
    publishedAt: '12 Oct 2024',
    heroLabel: "India's Digital Finance Transformation and Global Connectivity",
    takeaways: [
      'Central Bank Digital Currency (CBDC) aims to provide a safe, digital alternative to physical cash.',
      'It reduces the operational costs associated with printing and managing physical currency.',
      'Enhances financial inclusion and provides a programmable payment infrastructure.'
    ],
    prelimsPoints: [
      'CBDC is a legal tender issued by the RBI in digital form.',
      'Exchangeable at par with the existing physical currency.',
      'Accepted as a medium of payment and a safe store of value.',
      "It appears as a liability on the central bank's balance sheet."
    ],
    mainsAnalysis: [
      'The introduction of the Digital Rupee marks a paradigm shift in how sovereignty is expressed in the digital era. Unlike decentralized cryptocurrencies, CBDC provides the stability and trust of a central-bank-backed instrument while leveraging the efficiency of blockchain-like technology.',
      'One major advantage is the potential for programmable money. For instance, government subsidies could be programmed to be spent only on specific categories like fertilizers or education, drastically reducing leakage in the Direct Benefit Transfer mechanism.'
    ],
    quote:
      'The Digital Rupee will significantly lower the cost of cash management and enable a more efficient, real-time payment system that works even without extensive internet connectivity in the future.',
    pyqReference:
      'Discuss the potential benefits and challenges associated with the introduction of Central Bank Digital Currency (CBDC) in India. How can it revolutionize the financial inclusion landscape? (250 words)'
  },
  {
    id: 'basic-structure',
    title: 'Revisiting the Basic Structure Doctrine in Contemporary Jurisprudence',
    excerpt:
      'A comprehensive analysis of recent Supreme Court observations regarding the constitutional validity of legislative overrides and the evolving boundaries of judicial review in federal structures.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=640&q=80',
    tags: ['Polity', 'GS-II'],
    readTime: '4 Min Read',
    signal: 'Trending',
    signalTone: 'success',
    importance: 'High Importance',
    author: 'CivilServe Editorial Desk',
    authorRole: 'Constitution and Governance Team',
    publishedAt: '10 Oct 2024',
    heroLabel: 'Judicial Review, Constitutional Limits, and Parliamentary Power',
    takeaways: [
      'The Basic Structure doctrine limits Parliament from altering the Constitution in ways that destroy its core identity.',
      'Recent debates focus on judicial review, separation of powers, and democratic accountability.',
      'For UPSC, the doctrine connects constitutional morality with institutional checks and balances.'
    ],
    prelimsPoints: [
      'The doctrine emerged from Kesavananda Bharati v. State of Kerala.',
      'Judicial review is considered part of the basic structure.',
      'Parliament can amend the Constitution but cannot destroy its basic identity.',
      'Federalism, secularism, and rule of law are commonly cited basic features.'
    ],
    mainsAnalysis: [
      'The Basic Structure doctrine remains central to Indian constitutionalism because it balances constitutional flexibility with institutional restraint. It allows Parliament to respond to social change while preventing majoritarian erosion of core values.',
      'Contemporary jurisprudence increasingly tests the boundary between elected authority and judicial guardianship. This debate is especially relevant in questions involving tribunal reforms, federal arrangements, and rights-based governance.'
    ],
    quote:
      'The doctrine is not a barrier to reform; it is a constitutional safety valve that protects the Republic from losing its foundational character.',
    pyqReference:
      'Examine the significance of the Basic Structure doctrine in preserving constitutional democracy in India. (250 words)'
  }
];
