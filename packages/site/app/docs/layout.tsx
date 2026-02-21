import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />
      <DocsSidebar />
      <main className="lg:pl-64 pt-16">
        <div className="container mx-auto px-4 py-8 lg:max-w-4xl">
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-border">
            {children}
          </article>
        </div>
      </main>
    </div>
  );
}
