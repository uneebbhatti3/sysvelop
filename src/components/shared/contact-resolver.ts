import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/schema";

// Loaded on demand by contact-form.tsx.
export const contactResolver = zodResolver(contactSchema);
