# Local website

Open `index.html` in Chrome. No installation or local server is needed.

The same files can be published with GitHub Pages.

## Golf seasons

The golf archive covers calendar years from 2001 through 2026: the Masters, PGA Championship,
U.S. Open, The Open, THE PLAYERS Championship, and TOUR Championship. Each tournament has
dates, available course details, a leaderboard, round scores, and available playoff results.
Canceled events are included without a winner. Scores are saved snapshots, with an update date
and a link to the ESPN source on each tournament page.

The data uses local JavaScript files, so golf also works when opening `index.html` directly.
Refresh the archive with Node.js 22 or later (requires internet access):

```powershell
node tools/build-golf-data.mjs 2001 2026
node tools/check-golf.mjs
```

To refresh only a recent year, pass that year twice. The importer preserves other saved seasons
and rebuilds the year index. Source responses are cached by retrieval date in the system temporary
directory under `theoweb-golf-source`; remove that day's cached responses to re-fetch them the same day.
Historical playoff hole scores can be incomplete. Regulation totals exclude playoff strokes;
the 2019–2024 TOUR Championships explicitly note their FedExCup starting-strokes format.

## Design preferences

- 2026-08-05: Do not default the interface to green for boxes, borders, buttons, or text. Prefer blue, orange, yellow, or neutral colors unless green is specifically requested or essential to the subject.
