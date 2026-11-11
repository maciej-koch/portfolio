import { content } from "@/lib/content";
import { useCopy } from "./hooks";
import Icon from "./Icons";

export default function Corner() {
  const { other } = useCopy();
  return (
    <footer className="corner wipeable row-start-3 mt-3 flex gap-5 text-[0.9rem] lg:col-span-2 lg:row-start-3 lg:mt-0">
      {content.links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          className="inline-flex text-muted transition-colors duration-300 hover:text-text focus-visible:text-text"
          target={l.url.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={l.label}
          title={l.label}
        >
          <Icon name={l.label} />
        </a>
      ))}
      {/* the same section in the other language */}
      <a
        href={other.url}
        hrefLang={other.label.toLowerCase()}
        lang={other.label.toLowerCase()}
        className="inline-flex items-center font-mono text-base text-muted transition-colors duration-300 hover:text-text hover:no-underline focus-visible:text-text"
        onClick={(e) => (e.currentTarget.href = other.url + location.hash)}
        aria-label={other.name}
        title={other.name}
      >
        {other.label}
      </a>
    </footer>
  );
}
