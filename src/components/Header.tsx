import cherryCrew from "@/assets/cherry-crew.png";
import ruby from "@/assets/ruby.png";
import { LangSwitcher } from "./LangSwitcher";
import type { Lang } from "@/lib/i18n";

export function Header({
  displayName,
  tagline,
  lang,
  onLang,
}: {
  displayName: string;
  tagline: string;
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="cr-reel h-1.5" aria-hidden />
      <div className="mx-auto flex max-w-[480px] items-center gap-3 px-4 pt-3 pb-2">
        <img
          src={ruby}
          alt="Ruby the cherry mascot"
          width={56}
          height={56}
          className="h-12 w-12 -mr-1 drop-shadow-[0_4px_10px_rgba(225,29,72,0.45)]"
        />
        <div className="flex-1 min-w-0">
          <h1 className="cr-wordmark text-2xl leading-none">{displayName}</h1>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{tagline}</p>
        </div>
        <LangSwitcher lang={lang} onChange={onLang} />
      </div>
    </header>
  );
}

export function MascotEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <img src={cherryCrew} alt="Cherry crew" width={180} height={180} className="h-32 w-auto opacity-90" />
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
