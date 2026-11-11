import Site from "@/components/Site";
import { content, copy } from "@/lib/content";
import { pageMetadata } from "@/lib/i18n";

export const revalidate = 86400; // 24h

// the <title> is rendered by Site (it follows the active section), so the metadata leaves it out
const { title: _, ...metadata } = pageMetadata("en", "/", { title: content.title, description: copy.en.description });
export { metadata };

export default function Page() {
  return <Site />;
}
