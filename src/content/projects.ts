// Real projects only, honestly labelled. The owner adds them in the dashboard
// (/admin/case-studies), and this file is the only way the site reads them, results included.
// The Work section (and links to it) are hidden while none are published.
import { readProjects } from "@/lib/content";

export type Project = {
  id: string;
  name: string;
  kind: "Client project" | "Studio project";
  summary: string;
  results: { label: string; value: string }[];
  stack: string[];
  url?: string;
  image?: { src: string; width: number; height: number; alt: string };
};

// TODO(owner): add projects in /admin/case-studies (PRD Open Decision #5).
export const getProjects = readProjects;

export async function getHasWork() {
  return (await getProjects()).length > 0;
}
