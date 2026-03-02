export interface CommitteeMember {
  slug: string;
  name: string;
  initials: string;
  role: string;
  roleShort: string;
  batch: string;
  company: string;
  jobTitle: string;
  location: string;
  bio: string;
  email: string;
  linkedin?: string;
  github?: string;
  website?: string;
  avatarColor: string; // Tailwind bg- class
  isKeyMember: boolean; // shown on homepage
  responsibilities: string[];
  achievements: string[];
  term: string; // e.g. "2024 – 2026"
}

export const COMMITTEE: CommitteeMember[] = [
  {
    slug: 'president',
    name: 'Dr. Mohammed Rafiqul Islam',
    initials: 'MR',
    role: 'President',
    roleShort: 'President',
    batch: 'Batch 2008',
    company: 'Dhaka International University',
    jobTitle: 'Associate Professor, CSE Department',
    location: 'Dhaka, Bangladesh',
    bio: 'Dr. Rafiqul Islam is a faculty member and alumnus of the CSE Department at DIU. With over 15 years in academia and research, he leads the alumni association with a vision of turning CSE DIU graduates into a globally connected, impactful network. He holds a PhD in Machine Learning from BUET and has been instrumental in establishing the formal alumni structure.',
    email: 'president@csediualumni.com',
    linkedin: 'https://linkedin.com',
    avatarColor: 'bg-blue-700',
    isKeyMember: true,
    responsibilities: [
      'Overall leadership and strategic direction of the association',
      'Liaison between alumni and university administration',
      'Chairing executive committee meetings',
      'Representing the association at national and international forums',
    ],
    achievements: [
      'Grew alumni memberships from 200 to 1,200+ in two years',
      'Established the annual CSE DIU Tech Summit',
      'Secured department funding for the new PC lab through alumni donations',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'vice-president',
    name: 'Nusrat Jahan',
    initials: 'NJ',
    role: 'Vice President',
    roleShort: 'Vice President',
    batch: 'Batch 2012',
    company: 'BRAC IT Services',
    jobTitle: 'Senior Software Engineer',
    location: 'Dhaka, Bangladesh',
    bio: 'Nusrat Jahan is a Senior Software Engineer at BRAC IT Services with expertise in cloud infrastructure and distributed systems. As Vice President, she oversees the Women in Tech initiative and coordinates partnership outreach with tech companies to create employment opportunities for alumni.',
    email: 'vp@csediualumni.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    avatarColor: 'bg-violet-600',
    isKeyMember: true,
    responsibilities: [
      'Assisting the President and deputising in their absence',
      'Leading the Women in Tech initiative',
      'Industry partnership and corporate outreach',
      'Overseeing the mentorship programme',
    ],
    achievements: [
      'Established the Women in Tech scholarship (3 awardees annually)',
      'Onboarded 12 corporate partners offering job placement to alumni',
      'Launched the alumni mentorship programme matching 80+ pairs',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'general-secretary',
    name: 'Farhan Ahmed',
    initials: 'FA',
    role: 'General Secretary',
    roleShort: 'Gen. Secretary',
    batch: 'Batch 2015',
    company: 'REVE Systems',
    jobTitle: 'Product Manager',
    location: 'Dhaka, Bangladesh',
    bio: 'Farhan Ahmed is a Product Manager at REVE Systems, with a background in software engineering and agile product development. As General Secretary, he manages the day-to-day operations, maintains records, coordinates committee communication, and drives the platform roadmap for csediualumni.com.',
    email: 'secretary@csediualumni.com',
    linkedin: 'https://linkedin.com',
    avatarColor: 'bg-emerald-600',
    isKeyMember: true,
    responsibilities: [
      'Maintaining official records, minutes, and correspondence',
      'Coordinating committee sub-groups and task forces',
      'Managing the platform development roadmap',
      'Organising the AGM (Annual General Meeting)',
    ],
    achievements: [
      'Led the development and launch of this alumni platform',
      'Standardised the membership application process reducing approval time by 60%',
      'Published the first official alumni newsletter reaching 900+ subscribers',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'treasurer',
    name: 'Tasnia Sultana',
    initials: 'TS',
    role: 'Treasurer',
    roleShort: 'Treasurer',
    batch: 'Batch 2013',
    company: 'Grameenphone',
    jobTitle: 'Finance Manager',
    location: 'Dhaka, Bangladesh',
    bio: "Tasnia Sultana is a Finance Manager at Grameenphone and a Chartered Accountant (CA). She manages the association's finances, maintains transparent donation records, and ensures every taka raised is spent on the community's stated objectives. She introduced quarterly financial reporting to the general membership.",
    email: 'treasurer@csediualumni.com',
    linkedin: 'https://linkedin.com',
    avatarColor: 'bg-amber-600',
    isKeyMember: true,
    responsibilities: [
      'Managing all financial accounts and budgets',
      'Maintaining donation campaign ledgers',
      'Producing quarterly financial reports for members',
      'Processing scholarship disbursements',
    ],
    achievements: [
      'Raised ৳8.5 lakh through the 2025 Scholarship Campaign',
      'Achieved 100% financial audit compliance in the 2024–25 term',
      'Introduced online donation receipts reducing manual workload by 80%',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'joint-secretary',
    name: 'Sabbir Hossain',
    initials: 'SH',
    role: 'Joint Secretary',
    roleShort: 'Joint Secretary',
    batch: 'Batch 2016',
    company: 'BJIT Group',
    jobTitle: 'Full Stack Developer',
    location: 'Dhaka, Bangladesh',
    bio: 'Sabbir Hossain is a Full Stack Developer at BJIT Group specialising in React and Node.js. As Joint Secretary, he assists the General Secretary, manages event logistics, and coordinates volunteer networks for major alumni gatherings.',
    email: 'jointsec@csediualumni.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    avatarColor: 'bg-cyan-600',
    isKeyMember: false,
    responsibilities: [
      'Assisting the General Secretary in administrative duties',
      'Managing event logistics and volunteer coordination',
      'Membership intake and onboarding communications',
      'Maintaining the alumni directory accuracy',
    ],
    achievements: [
      'Organised the 2025 Annual Reunion with 450+ attendees',
      'Grew the volunteer network to 60+ active volunteers',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'it-secretary',
    name: 'Arif Khan',
    initials: 'AK',
    role: 'IT Secretary',
    roleShort: 'IT Secretary',
    batch: 'Batch 2017',
    company: 'DataSoft Systems',
    jobTitle: 'DevOps Engineer',
    location: 'Dhaka, Bangladesh',
    bio: 'Arif Khan is a DevOps Engineer at DataSoft Systems, responsible for CI/CD pipelines and cloud infrastructure. As IT Secretary, he oversees the technical health of the platform, manages the hosting environment, and coordinates the developer volunteer team.',
    email: 'it@csediualumni.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    avatarColor: 'bg-indigo-600',
    isKeyMember: false,
    responsibilities: [
      'Platform infrastructure management and uptime',
      'Leading the developer volunteer team',
      'Coordinating security audits and updates',
      'Managing the IT budget and vendor relationships',
    ],
    achievements: [
      'Achieved 99.9% platform uptime in the 2024–25 term',
      'Reduced infrastructure costs by 35% through optimisation',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'cultural-secretary',
    name: 'Lamia Rahman',
    initials: 'LR',
    role: 'Cultural Secretary',
    roleShort: 'Cultural Secretary',
    batch: 'Batch 2018',
    company: 'ShopUp',
    jobTitle: 'UX Designer',
    location: 'Dhaka, Bangladesh',
    bio: 'Lamia Rahman is a UX Designer at ShopUp with a passion for community building and cultural events. As Cultural Secretary, she organises the annual reunion, cultural evenings, and alumni engagement activities that strengthen the bond between graduates.',
    email: 'cultural@csediualumni.com',
    linkedin: 'https://linkedin.com',
    avatarColor: 'bg-pink-600',
    isKeyMember: false,
    responsibilities: [
      'Planning and executing cultural events and reunions',
      'Managing the alumni social media presence',
      'Producing the alumni magazine and newsletters',
      'Coordinating the annual awards ceremony',
    ],
    achievements: [
      'Organised the Grand Reunion 2025 with record attendance',
      'Launched the bi-annual alumni e-magazine',
    ],
    term: '2024 – 2026',
  },
  {
    slug: 'womens-affairs-secretary',
    name: 'Sadia Islam',
    initials: 'SI',
    role: "Women's Affairs Secretary",
    roleShort: 'Women Affairs',
    batch: 'Batch 2019',
    company: 'BTCL',
    jobTitle: 'Data Analyst',
    location: 'Dhaka, Bangladesh',
    bio: "Sadia Islam is a Data Analyst at Bangladesh Telecommunications Company Limited (BTCL). As Women's Affairs Secretary, she champions gender inclusivity, supports female alumni through community programmes, and works to increase women's participation in the association's leadership.",
    email: 'womens@csediualumni.com',
    linkedin: 'https://linkedin.com',
    avatarColor: 'bg-rose-500',
    isKeyMember: false,
    responsibilities: [
      "Advocating for women's representation across all committee roles",
      'Running the Women in Tech support group',
      'Organising leadership workshops for female alumni',
      'Supporting female alumni job referral network',
    ],
    achievements: [
      'Increased female committee representation to 37.5%',
      'Established a peer support network of 120+ female alumni',
    ],
    term: '2024 – 2026',
  },
];

export function getCommitteeMember(slug: string): CommitteeMember | undefined {
  return COMMITTEE.find((m) => m.slug === slug);
}

export function getKeyMembers(): CommitteeMember[] {
  return COMMITTEE.filter((m) => m.isKeyMember);
}

// ─── Past Committees ──────────────────────────────────────────────────────────

export interface PastMember {
  name: string;
  initials: string;
  role: string;
  roleShort: string;
  batch: string;
  company: string;
  jobTitle: string;
  avatarColor: string;
}

export interface PastCommitteeTerm {
  /** URL-safe slug, e.g. "2022-2024" */
  slug: string;
  /** Display label, e.g. "2022 – 2024" */
  label: string;
  description: string;
  highlights: string[];
  members: PastMember[];
}

export const PAST_COMMITTEES: PastCommitteeTerm[] = [
  {
    slug: '2022-2024',
    label: '2022 – 2024',
    description:
      'The 2022–2024 committee oversaw the transition from a Facebook-group-based community to a formal registered association, introduced the first tiered membership system, and launched the biennial reunion event.',
    highlights: [
      'Registered the association as a formal legal entity',
      'Introduced tiered membership (Regular, Life, Honorary)',
      'Hosted the first-ever Grand Reunion with 300+ attendees',
      'Launched the job board with 80+ listings in year one',
    ],
    members: [
      {
        name: 'Prof. Zahirul Haque',
        initials: 'ZH',
        role: 'President',
        roleShort: 'President',
        batch: 'Batch 2005',
        company: 'DIU',
        jobTitle: 'Professor, CSE Department',
        avatarColor: 'bg-blue-700',
      },
      {
        name: 'Kamrul Islam',
        initials: 'KI',
        role: 'Vice President',
        roleShort: 'Vice President',
        batch: 'Batch 2009',
        company: 'Robi Axiata',
        jobTitle: 'Network Engineer',
        avatarColor: 'bg-violet-600',
      },
      {
        name: 'Rupa Akter',
        initials: 'RA',
        role: 'General Secretary',
        roleShort: 'Gen. Secretary',
        batch: 'Batch 2011',
        company: 'Selise Digital Platforms',
        jobTitle: 'Software Engineer',
        avatarColor: 'bg-emerald-600',
      },
      {
        name: 'Sadman Sakib',
        initials: 'SS',
        role: 'Treasurer',
        roleShort: 'Treasurer',
        batch: 'Batch 2010',
        company: 'Dutch-Bangla Bank',
        jobTitle: 'Senior IT Officer',
        avatarColor: 'bg-amber-600',
      },
      {
        name: 'Mithila Chowdhury',
        initials: 'MC',
        role: 'Joint Secretary',
        roleShort: 'Joint Secretary',
        batch: 'Batch 2013',
        company: 'Samsung R&D',
        jobTitle: 'Software Developer',
        avatarColor: 'bg-cyan-600',
      },
      {
        name: 'Imran Hossain',
        initials: 'IH',
        role: 'IT Secretary',
        roleShort: 'IT Secretary',
        batch: 'Batch 2014',
        company: 'TigerIT Bangladesh',
        jobTitle: 'Full Stack Developer',
        avatarColor: 'bg-indigo-600',
      },
      {
        name: 'Nasrin Begum',
        initials: 'NB',
        role: 'Cultural Secretary',
        roleShort: 'Cultural Secretary',
        batch: 'Batch 2015',
        company: 'Pathao',
        jobTitle: 'Product Designer',
        avatarColor: 'bg-pink-600',
      },
      {
        name: 'Fariha Tasnim',
        initials: 'FT',
        role: "Women's Affairs Secretary",
        roleShort: 'Women Affairs',
        batch: 'Batch 2016',
        company: 'BRAC',
        jobTitle: 'Data Analyst',
        avatarColor: 'bg-rose-500',
      },
    ],
  },
  {
    slug: '2020-2022',
    label: '2020 – 2022',
    description:
      'The 2020–2022 term navigated the COVID-19 pandemic, pioneering virtual events and online networking that kept the community alive during an unprecedented global crisis. The committee established the first online scholarship fund.',
    highlights: [
      'Pivoted all events to virtual formats during the pandemic',
      'Raised ৳3.2 lakh for the COVID Relief Scholarship Fund',
      'Grew the community from 400 to 900 members online',
      'Launched the first alumni newsletter (quarterly, 600+ subscribers)',
    ],
    members: [
      {
        name: 'Dr. Anisur Rahman',
        initials: 'AR',
        role: 'President',
        roleShort: 'President',
        batch: 'Batch 2003',
        company: 'DIU',
        jobTitle: 'Associate Professor, CSE',
        avatarColor: 'bg-blue-700',
      },
      {
        name: 'Shahriar Kabir',
        initials: 'SK',
        role: 'Vice President',
        roleShort: 'Vice President',
        batch: 'Batch 2007',
        company: 'Therap Services',
        jobTitle: 'Senior Software Engineer',
        avatarColor: 'bg-violet-600',
      },
      {
        name: 'Afsana Mimi',
        initials: 'AM',
        role: 'General Secretary',
        roleShort: 'Gen. Secretary',
        batch: 'Batch 2008',
        company: 'Enosis Solutions',
        jobTitle: 'QA Engineer',
        avatarColor: 'bg-emerald-600',
      },
      {
        name: 'Tanvir Ahmed',
        initials: 'TA',
        role: 'Treasurer',
        roleShort: 'Treasurer',
        batch: 'Batch 2009',
        company: 'Islami Bank',
        jobTitle: 'IT Manager',
        avatarColor: 'bg-amber-600',
      },
      {
        name: 'Shuvo Roy',
        initials: 'SR',
        role: 'Joint Secretary',
        roleShort: 'Joint Secretary',
        batch: 'Batch 2011',
        company: 'Kona Software Lab',
        jobTitle: 'Android Developer',
        avatarColor: 'bg-cyan-600',
      },
      {
        name: 'Mahbub Alam',
        initials: 'MA',
        role: 'IT Secretary',
        roleShort: 'IT Secretary',
        batch: 'Batch 2012',
        company: 'Augmedix',
        jobTitle: 'DevOps Engineer',
        avatarColor: 'bg-indigo-600',
      },
      {
        name: 'Tania Sultana',
        initials: 'TS',
        role: 'Cultural Secretary',
        roleShort: 'Cultural Secretary',
        batch: 'Batch 2013',
        company: 'Shajgoj',
        jobTitle: 'UX Researcher',
        avatarColor: 'bg-pink-600',
      },
    ],
  },
  {
    slug: '2018-2020',
    label: '2018 – 2020',
    description:
      'The founding committee of 2018–2020 established the CSE DIU Alumni Association from the ground up — drafting the constitution, organising the inaugural general meeting, and creating the first membership register.',
    highlights: [
      'Drafted and ratified the founding constitution',
      'Held the inaugural AGM with 150+ alumni in attendance',
      'Created the first membership register (200 founding members)',
      'Organised the first alumni career seminar',
    ],
    members: [
      {
        name: 'Mr. Mostafa Kamal',
        initials: 'MK',
        role: 'Founding President',
        roleShort: 'President',
        batch: 'Batch 2001',
        company: 'Leads Corporation',
        jobTitle: 'Chief Technology Officer',
        avatarColor: 'bg-blue-700',
      },
      {
        name: 'Shamsul Alam',
        initials: 'SA',
        role: 'Founding Vice President',
        roleShort: 'Vice President',
        batch: 'Batch 2003',
        company: 'Brain Station 23',
        jobTitle: 'Senior Manager, Engineering',
        avatarColor: 'bg-violet-600',
      },
      {
        name: 'Dilruba Khanam',
        initials: 'DK',
        role: 'Founding Secretary',
        roleShort: 'Gen. Secretary',
        batch: 'Batch 2004',
        company: 'Grameenphone',
        jobTitle: 'Business Analyst',
        avatarColor: 'bg-emerald-600',
      },
      {
        name: 'Nazrul Islam',
        initials: 'NI',
        role: 'Founding Treasurer',
        roleShort: 'Treasurer',
        batch: 'Batch 2004',
        company: 'BRAC Bank',
        jobTitle: 'Assistant Vice President, IT',
        avatarColor: 'bg-amber-600',
      },
      {
        name: 'Rubel Hossain',
        initials: 'RH',
        role: 'Joint Secretary',
        roleShort: 'Joint Secretary',
        batch: 'Batch 2006',
        company: 'Walton Hi-Tech',
        jobTitle: 'Software Developer',
        avatarColor: 'bg-cyan-600',
      },
      {
        name: 'Masuma Akter',
        initials: 'MA',
        role: 'Cultural Secretary',
        roleShort: 'Cultural Secretary',
        batch: 'Batch 2007',
        company: 'Freelance',
        jobTitle: 'Graphic Designer',
        avatarColor: 'bg-pink-600',
      },
    ],
  },
];

export function getPastTerm(slug: string): PastCommitteeTerm | undefined {
  return PAST_COMMITTEES.find((t) => t.slug === slug);
}
