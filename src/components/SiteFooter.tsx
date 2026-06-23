import { readFileSync } from "fs";
import { join } from "path";
import { resolveLazyImages } from "@/lib/lazyImages";

const footerHtml = resolveLazyImages(
  readFileSync(join(process.cwd(), "src/content/footer.html"), "utf-8")
);

export default function SiteFooter() {
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
