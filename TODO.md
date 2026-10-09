# TODO / Állapot — 2026-10-09

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
  okozott. Ez minden fájltípusra (CSS, JS, képek) vonatkozik.
- **Cache-busting szabály**: az `index.html`-ben a stylesheet és script linkek
  verziózva vannak (`style.css?v=5`, `script.js?v=1`). Minden alkalommal, amikor
  módosítod a style.css-t vagy script.js-t, **növeld a `?v=` számot** az
  index.html-ben, különben a böngésző (akár Zalán saját Chrome-ja is, nem csak a
  Claude Browser pane) a régi verziót mutathatja.
- GitHub repo: https://github.com/pokazalan/vulome-dogfight (Zalán saját fiókja)
- Élő oldal: https://vulome-dogfight.netlify.app — 2026-10-09-én Zalán mondta
  "mehet élesbe", azóta ez az állapot éles (lásd lent, d179df3 commitig).

## Legutóbb élesített dolgok (Netlify-on élnek, 2026-10-09 óta)
- **Stage 2 letöltés gombok**: a játék szekcióban (`#game`) a "PLAY FULLSCREEN" gomb alatt
  egy "...or download and install it on your own device:" sor + 4 gomb
  (WINDOWS / macOS Intel / macOS Apple Silicon / ANDROID), mindegyik közvetlenül
  a megfelelő fájlra linkel (nem GitHub oldalra). Az ikonok (🪟🍎🤖) nagyobbra
  véve, jól látszanak. A figyelmeztető szöveg "Windows/Mac: első indításkor"
  része szándékosan villog (sárga, `.blink-text`), hogy felhívja a figyelmet a
  platform-specifikus megnyitási instrukciókra (Mac: jobb klikk→Megnyitás;
  Windows: További információ→Futtatás mégis; Android: ismeretlen források).
  A natív csomagok egy külön GitHub repóban vannak:
  https://github.com/pokazalan/dogfight-game-releases (Release v1.0.1, egyetlen
  aktív verzió — a régi v1.0.0-t töröltük) — ez a landing page-től FÜGGETLEN
  repo, a push oda NEM érinti a Netlify-t.
  A natív build forrása (Electron desktop + Capacitor Android projekt, és a
  letöltött/összeszerelt build eszközök) itt vannak: `/Users/macbook/Claude/dogfight-native/`
  (ugyanaz a tartalom pusholva a dogfight-game-releases repóba is).
  A játék maga egyetlen önálló HTML fájl (vanilla JS + Canvas, nincs külső
  framework), + 1 db `zene.mp3` — ezt helyi fájlként csomagoltuk be mindhárom
  natív appba (nem a `rafixhu.workers.dev`-et hívják futásidőben).
  Az app-ikon mindhárom platformon a DOGFIGHT borítókép
  (forrás: `/Volumes/1Terra/VULOME/DOGFIGHT/KÉPEK/VULOME_DOGFIGHT_cover_3000x3000.jpg`).
  Windows/Mac buildek **aláíratlanok** (nincs Apple Developer / Windows
  code-signing cert) — ez Zalán döntése alapján szándékos, a felhasználóknak
  egyszer át kell kattintaniuk egy rendszerfigyelmeztetésen. Az Android APK
  debug-signed (nincs külön release keystore). Zalán Mac Intel gépen tesztelte,
  működik; Windows/Android még nincs ténylegesen kipróbálva.
- **Follow gombok háttere**: a korábbi animált csík-háttér Zalán valódi
  Chrome-jában soha nem mozgott ténylegesen (a `getAnimations()` szerint futott,
  de nem rajzolódott újra — feltehetően Chrome/GPU-kompozitálási hiba
  pszeudo-elemen futó animációval). Zalán döntése alapján ezt elvetettük:
  most egy statikus, kétirányú ("X-rácsos"/rombusz) sárga hazárd-minta van a
  `.social-card::before`-on, animáció nélkül.
- **Fekete csíkok a PLAYER 1 és FOLLOW szekció hátterén (asztali nézet)**: az
  `assets/about-bg.jpg`, `assets/follow-bg.jpg`, `assets/game-bg.jpg` AI-generált
  képek eredetileg 640×360-as vászonra voltak renderelve úgy, hogy a tényleges
  kép csak ~520px széles volt középen, a két szélén fekete sáv volt beleőgetve.
  A `background-size: cover` ezeket a fekete sávokat is felskálázta, ami széles
  asztali nézetben sötét csíkokként látszott a tartalom két oldalán. Megoldás:
  a három képet `sips`-szel 520×360-ra vágtuk (a tényleges tartalom méretére),
  a fekete sávok nélkül. `game-bg.jpg`-n (Stage 1 szekció) ugyanez a hiba megvolt,
  azt is javítottuk, bár Zalán csak a másik kettőt említette.

## Korábban elkészült és már élesített dolgok (Netlify-on élnek)
- Teljes retro 16-bit arcade stílusú landing page (hero, Player 1, Stage 1 videó,
  Stage 2 játék, Follow közösségi linkek, lábléc)
- Magyar/angol nyelvváltó (alapértelmezett: angol)
- Képek optimalizálva (gyors betöltés)
- Mobil fejléc (HI-SCORE jobbra, zászlók középre) javítva
- Zenekar-portré lecserélve 16-bit pixel art verzióra (zöld-barna öltönyök,
  okker részletek, feszes vágás) — Zalán jóváhagyta, ez készen van
- "Powered by Netlify" badge kikapcsolva
