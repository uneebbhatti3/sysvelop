// All approved copy lives here, verbatim from docs/CONTENT.md.
// Do not add claims, numbers or sentences that are not in that file.

export const site = {
  name: "Sysvelop",
  tagline: "The digital systems behind growing businesses.",
  descriptor:
    "Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.",
  oneLiner:
    "Sysvelop designs and builds websites, apps, and AI automation that help growing businesses look established, run efficiently, and get found.",
  // Supplied by the owner (PRD Open Decision #6). Hidden wherever it is used if left empty.
  contactEmail: "hello@sysvelop.com",
} as const;

export type NavLink = { label: string; href: string; requiresWork?: boolean };

export const nav = {
  links: [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/#industries" },
    { label: "Engagements", href: "/#engagements" },
    { label: "Work", href: "/#work", requiresWork: true },
    { label: "FAQ", href: "/#faq" },
    // Every page ends with the contact section, so the in-page anchor always resolves.
    { label: "Contact", href: "#contact" },
  ] satisfies NavLink[],
  cta: { label: "Start a project", href: "#contact" },
};

// TODO(owner): UI labels below are not in docs/CONTENT.md and need approval.
export const uiLabels = {
  skipLink: "Skip to content",
  openMenu: "Open menu",
  menuTitle: "Menu",
  closeMenu: "Close menu",
  homeLink: "Sysvelop home",
  pauseAnimation: "Pause animation",
  playAnimation: "Play animation",
};

export const hero = {
  eyebrow: ["Websites", "Apps", "AI automation"],
  headline: "The digital systems behind growing businesses.",
  subheading:
    "Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.",
  primary: { label: "Start a project", href: "#contact" },
  secondary: { label: "See our work", href: "#work" },
  // TODO(owner): PROPOSED copy (docs/CONTENT.md §1), awaiting approval.
  indexLabel: "What we build",
  secondaryAlt: { label: "Explore services", href: "#services" },
  scrollCue: "Scroll to explore",
  orbitLabels: ["Websites", "Apps", "AI automation"],
  regions: "Working with small businesses across the United States, United Kingdom, UAE, and Canada.",
} as const;

export const why = {
  eyebrow: "Why Sysvelop",
  heading: "One connected system, not a pile of separate tools.",
  intro:
    "Most businesses end up with a website here, a tool there, and a marketing plan somewhere else. Sysvelop builds them as one system.",
  cards: [
    {
      id: "speed",
      title: "Fast from the first line of code.",
      text: "A slow page loses the customer before they read a word. Speed is built in, then measured.",
    },
    {
      id: "booking",
      title: "Bookings that handle themselves.",
      text: "Customers choose a time, the calendar updates, and confirmations send themselves.",
    },
    {
      id: "automation",
      title: "Automation for the routine work.",
      text: "Follow-ups, reminders, and enquiries run in the background while you run the business.",
    },
    {
      id: "findable",
      title: "Built to be found.",
      text: "Structure, speed, and on-page SEO are part of the build, not an afterthought.",
    },
  ],
} as const;

// Group titles and lines are approved; `short` is PROPOSED (docs/CONTENT.md §4).
// The services inside each group live in src/content/services.ts.
export const services = {
  eyebrow: "Services",
  heading: "Build it. Automate it. Grow it.",
  groups: [
    {
      id: "build",
      title: "Build",
      short: "Websites, web apps, mobile apps, UI/UX design",
      line: "Websites, web apps, and mobile apps, designed for clarity and engineered for speed.",
    },
    {
      id: "automate",
      title: "Automate",
      short: "Booking, lead follow-up, AI assistants, integrations",
      line: "AI workflows and integrations that take repetitive work off your plate.",
    },
    {
      id: "grow",
      title: "Grow",
      short: "SEO, social media, content for search",
      line: "SEO and social media that bring the right customers to what you've built.",
    },
  ],
} as const;

// TODO(owner): PROPOSED copy (docs/CONTENT.md §4a), awaiting approval.
// TODO(owner): PROPOSED label for the scrolling discipline strip.
export const ticker = {
  label: "Disciplines",
  items: ["Websites", "Web apps", "Mobile apps", "UI/UX design", "Booking automation", "AI assistants", "Integrations", "SEO", "Social media"],
} as const;

export const industries = {
  eyebrow: "Industries",
  heading: "Built for businesses that serve customers every day.",
  items: [
    { name: "Clinics", text: "Online booking, patient intake forms, and appointment reminders." },
    { name: "Studios", text: "Class schedules, memberships, and booking for fitness, beauty, and creative studios." },
    { name: "Service providers", text: "Quote requests, job scheduling, and follow-ups for trades and professional services." },
    { name: "Local brands", text: "Websites and online ordering that help local shops get found and chosen." },
  ],
} as const;

// TODO(owner): PROPOSED copy (docs/CONTENT.md §4b), awaiting approval. No prices.
export const engagements = {
  eyebrow: "Engagements",
  heading: "Three ways to start.",
  items: [
    {
      name: "Project build",
      text: "A defined scope, a fixed quote, and a confirmed timeline for a new website, app, or automation.",
      bestFor: "New builds and rebuilds",
    },
    {
      name: "Ongoing support",
      text: "Monthly updates, monitoring, SEO, and improvements after launch, on a retainer.",
      bestFor: "Live sites and apps",
    },
    {
      name: "Audit",
      text: "A review of your current website, tools, and workflows, with a written list of what to fix first.",
      bestFor: "Knowing where to begin",
    },
  ],
  bestForLabel: "Best for",
  cta: { label: "Discuss your project", href: "#contact" },
} as const;

// Stack supplied by the owner (Nov 2026). "Tools" extras beyond Docker and GitHub were
// suggested by Claude. TODO(owner): remove any Sysvelop does not actually use.
export const technologies = {
  eyebrow: "Technologies",
  heading: "The tools behind the systems.",
  groups: [
    {
      name: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion", "GSAP"],
    },
    {
      name: "Backend",
      items: ["Node.js", "Python", "Express.js", "NestJS", "PHP", "Django", "Flask", "FastAPI"],
    },
    { name: "Mobile", items: ["React Native", "Flutter", "Expo"] },
    { name: "AI and automation", items: ["OpenAI", "Claude", "n8n", "Zapier"] },
    {
      name: "Tools",
      items: ["Docker", "GitHub", "GitHub Actions", "Vercel", "AWS", "Figma", "Postman", "Google Search Console", "Google Analytics"],
    },
  ],
} as const;

export const work = {
  eyebrow: "Work",
  heading: "Systems in use, with the numbers behind them.",
} as const;

export const cta = {
  heading: "Ready to build the system behind your business?",
  text: "Tell us what you need. We'll reply with a clear plan.",
  button: "Start a project",
} as const;

export const contactForm = {
  heading: "Start a project",
  fields: {
    name: "Name",
    email: "Email",
    company: "Company (optional)",
    need: "What do you need?",
    message: "Message",
  },
  needOptions: ["Website", "App", "AI automation", "SEO or social media", "Not sure yet"],
  submit: "Send message",
  sending: "Sending…",
  success: "Thanks. Your message is in, and we'll be in touch soon.",
  // CONTENT.md §7 marks this line [CONFIRM]. The email clause is added only when an address is set.
  error: "Something went wrong sending your message. Please try again",
  errorEmailPrefix: "or email us at",
  // Proposed in the style CONTENT.md §7 asks for ("short and specific"). Awaiting approval.
  validation: {
    nameRequired: "Enter your name.",
    nameTooLong: "Keep your name under 100 characters.",
    emailInvalid: "Enter a valid email address.",
    companyTooLong: "Keep the company name under 120 characters.",
    needInvalid: "Choose what you need.",
    messageRequired: "Tell us a little about what you need.",
    messageTooLong: "Keep your message under 4,000 characters.",
  },
  privacyLine: "We use your details only to reply to your enquiry.",
} as const;

// Verbatim from docs/CONTENT.md, SEO and metadata.
export const seo = {
  title: "Sysvelop | The digital systems behind growing businesses",
  description:
    "Sysvelop builds fast websites, apps, and AI automation for small businesses, with online booking and workflows that keep the business moving.",
  ogTitle: "Sysvelop: The digital systems behind growing businesses",
  ogDescription:
    "Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.",
} as const;

export const notFoundPage = { heading: "This page isn't here.", link: "Back to home" } as const;

// TODO(owner): PROPOSED copy for the error page (docs/CONTENT.md §10), awaiting approval.
export const errorPage = { heading: "Something went wrong.", retry: "Try again" } as const;

export const footer = {
  descriptor: "The digital systems behind growing businesses.",
  copyright: "Sysvelop. All rights reserved.",
  wordmark: "Sysvelop",
} as const;
