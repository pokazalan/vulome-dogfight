# TODO / Állapot — 2026-10-03

## Munkafolyamat (FONTOS, mindig tartsd be)
Zalán kérte, hogy a Netlify build-credit fogyasztás miatt **mostantól csak helyben
szerkesztünk és tesztelünk**. NE pusholj a GitHub-ra (ami automatikusan Netlify
deployt indít), amíg Zalán kifejezetten nem mondja: "mehet élesbe" / "frissítsd
a Netlify-t" / hasonló.

- Helyi teszt szerver indítása: `preview_start` a "vulome-dogfight" launch.json
  configgal → http://localhost:8411
- A szerver a `vulome-dogfight/devserver.py`-t futtatja (nem a sima
  `python -m http.server`-t), mert az nem küldött no-cache fejlécet, és ez
  ismétlődő, nehezen diagnosztizálható "a régi verzió jelenik meg" hibákat
  okozott.
- **Cache-busting szabály**: az `index.html`-ben a stylesheet és script linkek
  verziózva vannak (`style.css?v=3`, `script.js?v=1`). Minden alkalommal, amikor
  módosítod a style.css-t vagy script.js-t, **növeld a `?v=` számot** az
  index.html-ben, különben a böngésző (akár Zalán saját Chrome-ja is, nem csak a
  Claude Browser pane) a régi verziót mutathatja.
- GitHub repo: https://github.com/pokazalan/vulome-dogfight (Zalán saját fiókja)
- Élő oldal (utoljára ezen az állapoton): https://vulome-dogfight.netlify.app
  — ez NEM tartalmazza a legújabb, még nem pusholt változtatásokat.

## Jelenlegi nyitott probléma — a Follow szekció gombjainak animált háttere

A Zalán kérésére hozzáadott mozgó "arcade hazárd csík" háttér (`.social-card::before`,
`@keyframes stripe-drift`, style.css) a Claude Browser pane-ben bizonyítottan fut
(`getAnimations()` és a transform-érték mérésével ellenőrizve), DE:
- Zalán a saját valódi Chrome-jában (nem a Claude pane-ben, hanem
  `http://localhost:8411` megnyitva a saját böngészőjében) sem látja mozogni.
- Gyorsítótár-problémát kizártuk (friss `?v=3` query, szerver oldalon is
  ellenőrizve helyes a kiszolgált CSS).
- Következő lépés, amit még nem kaptunk meg választ: megkérdeztem Zalántól,
  hogy a nyitóképernyőn a **"> INSERT COIN TO CONTINUE_"** felirat villog-e neki
  (ez egy már régóta élő, `animation: blink 1.4s steps(1) infinite;` CSS-animáció
  a hero-kicker elemen). Ha ez SEM villog neki, az rendszerszintű problémára utal
  (pl. macOS "Mozgás csökkentése" / Reduce Motion beállítás, vagy valami a
  Chrome-jában ami globálisan letiltja a CSS-animációkat) — nem a stripe-kód
  hibája.
- **Ezzel a kérdéssel kell folytatni**, amikor Zalán visszatér.

## Nem commitolt helyi változtatások
`index.html` és `style.css` jelenleg módosítva vannak (a stripe-animáció és a
cache-busting verziózás), de **nincsenek commitolva**. Ne veszítsd el őket —
nézd meg `git diff`-fel, mielőtt bármit felülírnál.

## Korábban elkészült és már élesített dolgok (Netlify-on élnek)
- Teljes retro 16-bit arcade stílusú landing page (hero, Player 1, Stage 1 videó,
  Stage 2 játék, Follow közösségi linkek, lábléc)
- Magyar/angol nyelvváltó (alapértelmezett: angol)
- Képek optimalizálva (gyors betöltés)
- Mobil fejléc (HI-SCORE jobbra, zászlók középre) javítva
- Zenekar-portré lecserélve 16-bit pixel art verzióra (zöld-barna öltönyök,
  okker részletek, feszes vágás) — Zalán jóváhagyta, ez készen van
- "Powered by Netlify" badge kikapcsolva
