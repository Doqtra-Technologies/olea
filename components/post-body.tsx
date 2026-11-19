// Styles for the HTML the WordPress editor produces: headings, paragraphs, lists, links and images.
const styles = [
  "[&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-forest-800",
  "[&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-forest-800",
  "[&_p]:mt-5 [&_p]:leading-relaxed [&_p]:text-ink/80",
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:leading-relaxed [&_ul]:text-ink/80",
  "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:leading-relaxed [&_ol]:text-ink/80",
  "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-leaf",
  "[&_figure]:mt-8 [&_img]:h-auto [&_img]:max-w-full",
].join(" ");

/** Renders a post body. The HTML comes from our own WordPress, written by its signed-in editors. */
export function PostBody({ html }: { html: string }) {
  return <div className={styles} dangerouslySetInnerHTML={{ __html: html }} />;
}
