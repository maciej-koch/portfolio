import Studio from "@/components/Studio";
import { pageMetadata } from "@/lib/i18n";
import { studio } from "@/lib/studio";

export const metadata = pageMetadata("pl", "/kochandcode", studio.copy.pl);

export default function Page() {
  return <Studio lang="pl" />;
}
