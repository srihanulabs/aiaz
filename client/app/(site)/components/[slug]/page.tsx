import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailsView from "@/features/showcase/components/ProjectDetailsView";
import { categories, projects } from "@/features/showcase/data/catalog";
import { details } from "@/features/showcase/data/details";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

const find = (slug: string) => {
  const project = projects.find((p) => p.slug === slug);
  const content = details[slug];
  const category = project && categories.find((c) => c.id === project.category);
  return project && content && category ? { project, content, category } : null;
};

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = find(slug);
  if (!found) return {};

  const { project, category } = found;
  return {
    title: `${project.name} — ${category.name} component`,
    description: project.summary,
    openGraph: {
      title: `${project.name} — ${category.name}`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const found = find(slug);
  if (!found) notFound();

  return (
    <ProjectDetailsView
      project={found.project}
      category={found.category}
      details={found.content}
    />
  );
}
