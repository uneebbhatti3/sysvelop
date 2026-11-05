// All approved copy lives here, verbatim from docs/CONTENT.md.
// Do not add claims, numbers or sentences that are not in that file.

export const site = {
  name: "Sysvelop",
  tagline: "The digital systems behind growing businesses.",
  descriptor:
    "Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.",
  oneLiner:
    "Sysvelop designs and builds websites, apps, and AI automation that help growing businesses look established, run efficiently, and get found.",
  // TODO(owner): public contact email (PRD Open Decision #6). Footer hides it while empty.
  contactEmail: "",
} as const;

export type NavLink = { label: string; href: string; requiresWork?: boolean };

export const nav = {
  links: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work", requiresWork: true },
    { label: "FAQ", href: "#faq" },
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
  pauseAnimation: "Pause animation",
  playAnimation: "Play animation",
  homeLink: "Sysvelop home",
};

export const hero = {
  eyebrow: ["Websites", "Apps", "AI automation"],
  headline: "The digital systems behind growing businesses.",
  subheading:
    "Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.",
  primary: { label: "Start a project", href: "#contact" },
  secondary: { label: "See our work", href: "#work" },
  booking: {
    label: "Booking",
    slots: ["Tue 09:30", "Tue 10:30", "Tue 11:30"],
    selectedIndex: 1,
    confirmed: "Confirmed",
    followUp: "Reminder scheduled",
  },
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

export const services = {
  eyebrow: "Services",
  heading: "Build it. Automate it. Grow it.",
  groups: [
    {
      id: "build",
      title: "Build",
      line: "Websites, web apps, and mobile apps, designed for clarity and engineered for speed.",
      items: ["Business websites", "Web applications", "Mobile apps", "UI/UX design"],
    },
    {
      id: "automate",
      title: "Automate",
      line: "AI workflows and integrations that take repetitive work off your plate.",
      items: [
        "Booking and scheduling automation",
        "Lead capture and follow-up",
        "AI assistants and automated replies",
        "Integrations between the tools you already use",
      ],
    },
    {
      id: "grow",
      title: "Grow",
      line: "SEO and social media that bring the right customers to what you've built.",
      items: ["Technical and on-page SEO", "Social media management", "Content that supports search"],
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
  privacyLine: "We use your details only to reply to your enquiry. See our",
  privacyLinkLabel: "Privacy Policy",
} as const;

export const footer = {
  descriptor: "The digital systems behind growing businesses.",
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  copyright: "Sysvelop. All rights reserved.",
  wordmark: "Sysvelop",
} as const;
