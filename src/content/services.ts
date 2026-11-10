// Service pages (/services/[slug]).
// `name` and the group lines are approved copy. Everything else in this file is
// TODO(owner): PROPOSED copy (docs/CONTENT.md §9), awaiting approval.

export type ServiceGroupId = "build" | "automate" | "grow";

export type Service = {
  slug: string;
  group: ServiceGroupId;
  name: string;
  /** One-line summary used on cards and as the meta description. */
  summary: string;
  intro: string;
  included: { title: string; text: string }[];
  fit: string[];
  related: string[];
};

export const servicePageLabels = {
  breadcrumbHome: "Home",
  breadcrumbServices: "Services",
  included: "What's included",
  fit: "A good fit when",
  related: "Related services",
  viewService: "View service",
  allServices: "All services",
  primary: "Start a project",
} as const;

export const servicesIndex = {
  eyebrow: "Services",
  heading: "Build it. Automate it. Grow it.",
  intro:
    "Sysvelop designs and builds websites, apps, and AI automation that help growing businesses look established, run efficiently, and get found.",
  metaTitle: "Services | Sysvelop",
  metaDescription:
    "Websites, web and mobile apps, UI/UX design, booking automation, AI assistants, integrations, SEO, and social media for small businesses.",
} as const;

export const serviceList: Service[] = [
  {
    slug: "business-websites",
    group: "build",
    name: "Business websites",
    summary: "Sites that load fast, explain what you do, and turn visits into enquiries.",
    intro:
      "A business website has one job: turn a visit into an enquiry. Sysvelop builds sites that load fast on any phone, make your services easy to understand, and give people a clear next step.",
    included: [
      { title: "Page structure", text: "Pages planned around what your customers need to know before they get in touch." },
      { title: "Responsive design", text: "Layouts built for phones first, then tablets and desktops." },
      { title: "Speed and SEO foundations", text: "Optimised images, clean code, and metadata, measured before launch." },
      { title: "Enquiry and booking forms", text: "Forms that send straight to your inbox or calendar." },
    ],
    fit: [
      "You don't have a website yet, or the one you have looks dated.",
      "Visitors arrive but rarely get in touch.",
      "Your site is slow or hard to update.",
    ],
    related: ["ui-ux-design", "technical-seo", "booking-automation"],
  },
  {
    slug: "web-applications",
    group: "build",
    name: "Web applications",
    summary: "Customer portals, dashboards, and internal tools built around how your business runs.",
    intro:
      "When spreadsheets and email threads stop keeping up, a web application gives your customers and staff one place to work. Sysvelop builds portals, dashboards, and internal tools around the way your business already runs.",
    included: [
      { title: "Customer portals", text: "Secure logins where customers book, pay, track orders, or download documents." },
      { title: "Dashboards and reporting", text: "The numbers you check every week, in one view, updated automatically." },
      { title: "Internal tools", text: "Admin panels and workflows that replace manual spreadsheets." },
      { title: "Accounts and permissions", text: "Role-based access, so each person sees only what they need." },
    ],
    fit: [
      "Your staff copy the same data between several tools.",
      "Customers email you for information they could look up themselves.",
      "An off-the-shelf tool almost fits, but not quite.",
    ],
    related: ["integrations", "ui-ux-design", "mobile-apps"],
  },
  {
    slug: "mobile-apps",
    group: "build",
    name: "Mobile apps",
    summary: "iOS and Android apps for booking, loyalty, and the services your customers use every week.",
    intro:
      "A mobile app keeps your business one tap away. Sysvelop builds iOS and Android apps from one codebase, so customers can book, order, and stay in touch from their phone.",
    included: [
      { title: "iOS and Android", text: "One codebase, released to both the App Store and Google Play." },
      { title: "Booking and ordering", text: "Customers choose a time or place an order in a few taps." },
      { title: "Push notifications", text: "Reminders, offers, and updates sent at the right moment." },
      { title: "Accounts and loyalty", text: "Saved details, visit history, and rewards that bring customers back." },
    ],
    fit: [
      "Customers use your service every week or month.",
      "You want reminders and offers to reach people directly.",
      "You run a loyalty or membership scheme on paper or cards.",
    ],
    related: ["web-applications", "booking-automation", "ui-ux-design"],
  },
  {
    slug: "ui-ux-design",
    group: "build",
    name: "UI/UX design",
    summary: "Clear interfaces and a consistent design system, so every screen looks and works the same way.",
    intro:
      "Good design makes a product obvious to use. Sysvelop designs interfaces and design systems so every screen is clear, consistent, and easy to build on.",
    included: [
      { title: "User flows", text: "The key journeys mapped, from first visit to completed task." },
      { title: "Wireframes and prototypes", text: "Clickable screens to review before anything is built." },
      { title: "Visual design", text: "Typography, colour, and layout that fit your brand." },
      { title: "Design system", text: "Reusable components and rules, so new screens stay consistent." },
    ],
    fit: [
      "People get stuck or drop off in your website or app.",
      "Your product looks different from screen to screen.",
      "You're planning a new product and want the design right first.",
    ],
    related: ["business-websites", "web-applications", "mobile-apps"],
  },
  {
    slug: "booking-automation",
    group: "automate",
    name: "Booking and scheduling automation",
    summary: "Online booking connected to your calendar, with confirmations and reminders sent for you.",
    intro:
      "Every booking taken by phone or email is time away from the work. Sysvelop sets up online booking that connects to your calendar, takes deposits if you need them, and sends confirmations and reminders for you.",
    included: [
      { title: "Online booking", text: "Customers see real availability and book in a few clicks, any time of day." },
      { title: "Calendar sync", text: "Bookings appear in Google or Outlook calendars as they are made." },
      { title: "Confirmations and reminders", text: "Email and SMS messages sent automatically before each appointment." },
      { title: "Deposits and payments", text: "Optional payment at booking to secure the slot." },
    ],
    fit: [
      "You take bookings by phone, email, or direct message.",
      "Missed appointments cost you time and money.",
      "Someone spends part of every day managing the diary.",
    ],
    related: ["lead-follow-up", "ai-assistants", "integrations"],
  },
  {
    slug: "lead-follow-up",
    group: "automate",
    name: "Lead capture and follow-up",
    summary: "Every enquiry captured, routed to the right place, and followed up on time.",
    intro:
      "An enquiry that waits a day for a reply often goes to someone else. Sysvelop captures every lead from your website, ads, and social channels, sends it to the right place, and follows up on time.",
    included: [
      { title: "Capture forms", text: "Forms and landing pages that collect the details you need." },
      { title: "Routing", text: "Each enquiry sent to the right person or inbox, instantly." },
      { title: "Automatic follow-up", text: "Email and SMS sequences that reply quickly and keep the conversation going." },
      { title: "CRM updates", text: "Every lead recorded in your CRM, with its source and status." },
    ],
    fit: [
      "Enquiries arrive in several places and some get missed.",
      "Replies depend on someone remembering to send them.",
      "You don't know which channels bring in your customers.",
    ],
    related: ["ai-assistants", "integrations", "booking-automation"],
  },
  {
    slug: "ai-assistants",
    group: "automate",
    name: "AI assistants and automated replies",
    summary: "Assistants that answer common questions and qualify enquiries using your own information.",
    intro:
      "Many of the questions your business receives have the same answers. Sysvelop builds AI assistants that answer them from your own information, qualify new enquiries, and hand over to a person when needed.",
    included: [
      { title: "Website chat assistant", text: "Answers questions about your services and hours, day and night." },
      { title: "Your own information", text: "Responses drawn from your pages, documents, and FAQs." },
      { title: "Enquiry qualification", text: "Collects the key details before passing a lead to you." },
      { title: "Human handover", text: "Conversations that need a person are routed to you or your staff." },
    ],
    fit: [
      "You answer the same questions many times a week.",
      "Enquiries come in outside business hours.",
      "You want faster replies without adding headcount.",
    ],
    related: ["lead-follow-up", "booking-automation", "integrations"],
  },
  {
    slug: "integrations",
    group: "automate",
    name: "Integrations between the tools you already use",
    summary: "Your CRM, calendar, payments, and email working from the same data.",
    intro:
      "Most businesses run on several tools that don't talk to each other. Sysvelop connects your CRM, calendar, payments, email, and accounting, so information is entered once and updates everywhere.",
    included: [
      { title: "Tool connections", text: "CRM, calendar, payments, email, and accounting connected through their APIs." },
      { title: "Data sync", text: "Customer and order details kept consistent across every system." },
      { title: "Automated workflows", text: "One action triggers the next, such as a payment creating an invoice and a welcome email." },
      { title: "Monitoring", text: "Alerts when a connection fails, so problems are fixed before they grow." },
    ],
    fit: [
      "Someone re-types the same information into several tools.",
      "Records in different systems don't match.",
      "You pay for tools that could do more if they were connected.",
    ],
    related: ["web-applications", "lead-follow-up", "booking-automation"],
  },
  {
    slug: "technical-seo",
    group: "grow",
    name: "Technical and on-page SEO",
    summary: "Structure, speed, and metadata set up so search engines understand what you offer.",
    intro:
      "Customers search before they buy. Sysvelop sets up the structure, speed, and on-page details that help search engines understand your business and show it to the right people.",
    included: [
      { title: "Technical fixes", text: "Crawl errors, broken links, redirects, and indexing issues resolved." },
      { title: "Site speed", text: "Core Web Vitals measured and improved." },
      { title: "On-page optimisation", text: "Titles, headings, metadata, and internal links aligned with what customers search for." },
      { title: "Local SEO", text: "Google Business Profile and location pages for businesses that serve an area." },
    ],
    fit: [
      "Your business doesn't appear when people search for your services.",
      "Your site has grown without a clear structure.",
      "You serve a local area and want to be found there.",
    ],
    related: ["search-content", "business-websites", "social-media"],
  },
  {
    slug: "social-media",
    group: "grow",
    name: "Social media management",
    summary: "Planned, consistent posting that keeps your business visible between visits.",
    intro:
      "Regular, useful posts keep your business in front of customers between visits. Sysvelop plans, creates, and publishes content for the channels your customers use.",
    included: [
      { title: "Content calendar", text: "A monthly plan of posts tied to your services and seasons." },
      { title: "Post creation", text: "Graphics and captions in your brand's style." },
      { title: "Scheduling and publishing", text: "Posts published consistently across your chosen channels." },
      { title: "Monthly reporting", text: "Reach, engagement, and enquiries from social, in one short report." },
    ],
    fit: [
      "You post when you remember, not on a plan.",
      "Your profiles don't reflect the quality of your work.",
      "You want social media to bring in enquiries, not just likes.",
    ],
    related: ["search-content", "technical-seo", "lead-follow-up"],
  },
  {
    slug: "search-content",
    group: "grow",
    name: "Content that supports search",
    summary: "Service pages and articles written around what your customers search for.",
    intro:
      "Search engines reward pages that answer real questions. Sysvelop writes service pages and articles around what your customers search for, so your site earns visits over time.",
    included: [
      { title: "Keyword research", text: "The questions and phrases your customers use, ranked by value." },
      { title: "Service pages", text: "A clear page for each service and location you offer." },
      { title: "Articles and guides", text: "Helpful content that answers common questions in your field." },
      { title: "Content updates", text: "Existing pages refreshed so they stay accurate and competitive." },
    ],
    fit: [
      "Your site has few pages beyond the homepage.",
      "Competitors appear for searches you should own.",
      "You want steady visits without paying for every click.",
    ],
    related: ["technical-seo", "social-media", "business-websites"],
  },
];

export const serviceHref = (slug: string) => `/services/${slug}`;

export function getService(slug: string) {
  return serviceList.find((s) => s.slug === slug);
}

export function servicesInGroup(group: ServiceGroupId) {
  return serviceList.filter((s) => s.group === group);
}
