import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { detectLang, setLang as persistLang } from "@/lib/i18n";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => { setLangState(detectLang()); }, []);
  const update = (l: Lang) => { persistLang(l); setLangState(l); };
  return [lang, update];
}

export function LangSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const langs: Lang[] = ["en", "ru", "es"];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-0.5 text-[11px] font-semibold uppercase tracking-wider">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded-full px-2.5 py-1 transition ${
            lang === l ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
