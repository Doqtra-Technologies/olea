import { getMenus } from "@/lib/content";
import { menus as defaultMenus } from "@/lib/menus";

// The menu PDFs live in WordPress. Old links to /menus/<file>.pdf (search results, the built-in content)
// are sent on to the current PDF for that menu, so there is only ever one copy to update.
export async function GET(_req: Request, { params }: RouteContext<"/menus/[file]">) {
  const { file } = await params;
  const ids = defaultMenus.filter((m) => m.pdf === `/menus/${file}`).map((m) => m.id);
  if (!ids.length) return new Response("Not found", { status: 404 });

  const menus = await getMenus().catch(() => null);
  const pdf = menus?.find((m) => ids.includes(m.id))?.pdf;
  if (!pdf || pdf.startsWith("/menus/")) return new Response("Menu PDF unavailable, please try again shortly", { status: 503 });
  return Response.redirect(pdf, 307);
}
