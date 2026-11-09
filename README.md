# crt-rack

**Your website, but it's a piece of rack gear.** A status rail, VFD clock, live data ticker, dB scroll readout, real LCP/CLS performance HUD, ⌘K command palette - and a power button that shuts the page down like a CRT and boots it back up at the top.

Zero dependencies. One CSS file, one JS file. No framework, no build step.

**[Live demo](https://bryanhamiltondev.github.io/crt-rack/)** · **[Running in production](https://bryanhamilton.info)**

## What's in the rack

| Module | What it does |
|---|---|
| Status rail | 34px fixed bottom bar, the chassis everything bolts into |
| VFD clock | Glowing cyan `HH:MM:SS`, ticks every second |
| Live ticker | Server-side PHP proxy fetches a ranked leaderboard (CORS-safe), 30-min cache, scrolls it marquee-style |
| Scroll readout | Page position as a percentage **and in dB** (`POS 42% · -7.5dB`) |
| Performance HUD | Real `largest-contentful-paint` + `layout-shift` via PerformanceObserver |
| ⌘K palette | Fuzzy page jump, arrow keys, Enter, Escape - plus easter eggs (`ls`, `whoami`, `rm -rf /`) |
| Power button | Full CRT shutdown: page crushes to a line, then a dot, then black - reboots expanded at the top. Theme toggles during the blackout. |

## Quick start

```html
<link rel="stylesheet" href="rack.css">
<script src="rack.js"></script>
```

That's it. The rail mounts itself on load.

For the live ticker, drop `src/ticker.php` on your server and point `$TICKER_URL` at any page with JSON-LD `ItemList` entries (or edit the regex for your source). No PHP? The ticker degrades to a static line automatically.

## Make it yours

Two arrays at the bottom of `rack.js`:

- `PAGES` - what the ⌘K palette indexes (label + URL pairs)
- `EGGS` - easter eggs the palette also matches

The `.chat` rule at the end of `rack.css` is a production-specific nudge for my own chat widget - delete it.

## Notes

- Respects `prefers-reduced-motion`: the CRT animation skips for those users.
- Mobile: HUD and dB readout hide, rail stays.
- MIT licensed. Built for [bryanhamilton.info](https://bryanhamilton.info) - every line of it running live there.

## The 404 bonus

The same build replaced my 404 with an oscilloscope: animated trace, grid glow, "SIGNAL LOST". Grab it from the production site's `/xyz` if you want the pattern.
