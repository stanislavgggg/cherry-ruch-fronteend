import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { trackEvent } from "@/lib/funnel";
import { getUid, haptic } from "@/lib/telegram";

export function SubscribeBar({ onSubscribe, lang }: { onSubscribe: () => void; lang: Lang }) {
  useEffect(() => {
    trackEvent("cta_view", { surface: "sticky" }, getUid());
  }, []);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2"
      style={{ background: "linear-gradient(180deg, transparent, rgba(18,6,8,0.95) 40%)" }}
    >
      <div className="mx-auto max-w-[480px]">
        <button
          onClick={() => {
            haptic("medium");
            trackEvent("cta_tap", { surface: "sticky" }, getUid());
            onSubscribe();
          }}
          className="cr-cta flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-extrabold tracking-tight"
        >
          <span>🍒</span>
          <span>{t(lang, "subscribe")}</span>
          <span>🍒</span>
        </button>
        <p className="mt-1.5 text-center text-[10px] text-rose/80">{t(lang, "disclaimer")}</p>
      </div>
    </div>
  );
}

export function ValueStrip({ lang }: { lang: Lang }) {
  return (
    <div className="cr-card mx-1 my-2 px-4 py-3 text-center">
      <p className="cr-gold-text text-sm font-bold">{t(lang, "valueStrip")}</p>
    </div>
  );
}

export function Interstitial({
  onSubscribe,
  onClose,
  lang,
}: {
  onSubscribe: () => void;
  onClose: () => void;
  lang: Lang;
}) {
  useEffect(() => {
    trackEvent("cta_view", { surface: "interstitial" }, getUid());
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-6">
      <div className="cr-card relative w-full max-w-sm cr-rise p-6 text-center">
        <div className="text-5xl">🍒</div>
        <h2 className="cr-wordmark mt-2 text-3xl">{t(lang, "joinFull")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t(lang, "joinSub")}</p>
        <button
          onClick={() => {
            haptic("medium");
            trackEvent("cta_tap", { surface: "interstitial" }, getUid());
            onSubscribe();
          }}
          className="cr-cta mt-5 w-full rounded-xl px-5 py-3 text-base font-extrabold"
        >
          {t(lang, "subscribe")}
        </button>
        <button onClick={onClose} className="mt-3 text-xs text-muted-foreground underline">
          {t(lang, "maybeLater")}
        </button>
        <p className="mt-4 text-[10px] text-rose/80">{t(lang, "disclaimer")}</p>
      </div>
    </div>
  );
}

export function UnlockBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="cr-burst text-7xl">🍒✨🍒</div>
    </div>
  );
}
