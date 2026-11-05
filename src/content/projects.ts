// Real projects only, honestly labelled. The Work section (and links to it)
// are hidden while this list is empty.

export type Project = {
  slug: string;
  name: string;
  kind: "Client project" | "Studio project";
  summary: string;
  results: { label: string; value: string }[];
  stack: string[];
  url?: string;
  image?: { src: string; width: number; height: number; alt: string };
};

// TODO(owner): supply projects and their labels (PRD Open Decision #5).
export const projects: Project[] = [];

export const hasWork = projects.length > 0;
