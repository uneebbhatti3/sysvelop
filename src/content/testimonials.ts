// Client testimonial form (/testimonial/[token]).
// TODO(owner): PROPOSED copy (docs/CONTENT.md §10), awaiting approval.

export const testimonialLimits = { name: 100, role: 100, company: 120, quoteMin: 10, quote: 1000 } as const;

// Home page section. Same proposal (§10).
export const testimonialsSection = {
  eyebrow: "Testimonials",
  heading: "In our clients' words.",
} as const;

export const testimonialForm = {
  metaTitle: "Share your experience | Sysvelop",
  heading: "Share your experience.",
  intro: "Tell us what it was like to work with Sysvelop and what changed for your business.",
  fields: {
    name: "Your name",
    role: "Role (optional)",
    company: "Company (optional)",
    quote: "Your testimonial",
  },
  consent: "Sysvelop may publish this testimonial with my name, role, and company.",
  submit: "Send testimonial",
  sending: "Sending…",
  success: "Thank you. Your testimonial has been received.",
  inactive: "This link is no longer active.",
  inactiveHelp: "Please ask Sysvelop for a new link.",
  errors: {
    invalid: "Check your name, write at least 10 characters, and tick the box.",
    limited: "Too many attempts. Try again in a few minutes.",
    failed: "Something went wrong. Please try again.",
  },
} as const;
