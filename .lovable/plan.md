Root cause from the screenshots: `Minified React error #31` means React is trying to render a plain object as UI text. The likely source is backend/config/news/live fields coming back as objects in Telegram/production data, while components assume strings.

Plan:

1. Add a small normalization layer in `src/lib/funnel.ts`
   - Convert config fields like `display_name`, `tagline`, CTA URLs, and news/live text fields to safe strings.
   - If a value is localized (`{ en, ru, ... }`) or otherwise object-shaped, pick a usable string instead of passing the object to React.
   - Keep fallbacks so the UI still opens even if the API response is malformed.

2. Harden direct render points
   - In `Header`, `ChannelPreview`, `NewsCard`, `LiveCard`, `LivePinnedCard`, and `LockedCard`, ensure rendered title/source/team/league/summary values are strings.
   - This prevents one bad item from crashing the whole Telegram Mini App.

3. Improve error visibility for this exact failure
   - Update the root error details to stringify non-Error values/objects more clearly in preview/dev.
   - This will make future Telegram logs show the actual offending object instead of only minified React #31.

4. Keep unrelated Telegram fetch noise out of scope
   - The `assetCache.ts Failed to fetch` and `web.telegram.org/a/#...` warning in the screenshot is Telegram/Chrome cache noise, not the React crash trigger.
   - I will not change app behavior around that unless a separate app network request is failing.

Validation after implementation:
- Open the preview at `/` and confirm it renders instead of the `Something tripped` boundary.
- Check console for absence of `React error #31`.
- Verify the main feed, Channel tab, Live tab, and onboarding still render with fallback text if API data is odd.