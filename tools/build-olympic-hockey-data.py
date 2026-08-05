import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

from lxml import html


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "olympic-hockey" / "data.js"
BASE_URL = "https://www.olympedia.org"
USER_AGENT = "TheosWebhouse/1.0 (educational project)"

EDITIONS = [
    (1920, 7, "Antwerp"),
    (1924, 29, "Chamonix"),
    (1928, 30, "St. Moritz"),
    (1932, 31, "Lake Placid"),
    (1936, 32, "Garmisch-Partenkirchen"),
    (1948, 33, "St. Moritz"),
    (1952, 34, "Oslo"),
    (1956, 35, "Cortina d'Ampezzo"),
    (1960, 36, "Squaw Valley"),
    (1964, 37, "Innsbruck"),
    (1968, 38, "Grenoble"),
    (1972, 39, "Sapporo"),
    (1976, 40, "Innsbruck"),
    (1980, 41, "Lake Placid"),
    (1984, 42, "Sarajevo"),
    (1988, 43, "Calgary"),
    (1992, 44, "Albertville"),
    (1994, 45, "Lillehammer"),
    (1998, 46, "Nagano"),
    (2002, 47, "Salt Lake City"),
    (2006, 49, "Turin"),
    (2010, 57, "Vancouver"),
    (2014, 58, "Sochi"),
    (2018, 60, "PyeongChang"),
    (2022, 62, "Beijing"),
    (2026, 72, "Milano Cortina"),
]

MONTHS = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}
SCORE_PATTERN = re.compile(r"\[?(\d+)\]?\s*[\-\u2013\u2014]\s*\[?(\d+)\]?")
ROUND_ROBIN_MEDAL_YEARS = {1924, 1928, 1936, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988}


def fetch(path):
    request = urllib.request.Request(BASE_URL + path, headers={"User-Agent": USER_AGENT})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(5 * (attempt + 1))


def clean(value):
    return " ".join(value.replace("[edit]", "").split())


def clean_team(value):
    return re.sub(r"\s+\d+$", "", value)


def parse_date(value, year):
    match = re.search(r"(\d{1,2})\s+([A-Z][a-z]{2})", value)
    if not match or match.group(2) not in MONTHS:
        return value
    return f"{year:04d}-{MONTHS[match.group(2)]:02d}-{int(match.group(1)):02d}"


def nearest_stage(table):
    headings = table.xpath("preceding::*[self::h2 or self::h3][1]")
    return clean(headings[0].text_content()) if headings else "Tournament"


def parse_matches(page_bytes, year):
    document = html.fromstring(page_bytes.decode("utf-8"))
    for footnote in document.xpath("//sup"):
        footnote.drop_tree()
    matches = []

    for table in document.xpath("//table"):
        rows = table.xpath(".//tr")
        if not rows:
            continue
        headers = [clean(cell.text_content()) for cell in rows[0].xpath("./th|./td")]
        if "Result" not in headers:
            continue

        stage = nearest_stage(table)
        for row in rows[1:]:
            cells = [clean(cell.text_content()) for cell in row.xpath("./th|./td")]
            if len(cells) < 5:
                continue

            score_index = next(
                (index for index, value in enumerate(cells) if SCORE_PATTERN.search(value)),
                None,
            )
            if score_index is None or score_index + 1 >= len(cells):
                continue

            score_match = SCORE_PATTERN.search(cells[score_index])
            team_one_index = score_index - 2 if score_index >= 2 and re.fullmatch(r"[A-Z]{3}|\u2013|\u2014|-", cells[score_index - 1]) else score_index - 1
            if team_one_index < 0:
                continue

            date_value = cells[1] if len(cells) > 1 else ""
            note = SCORE_PATTERN.sub("", cells[score_index], count=1).strip(" ()")
            matches.append(
                {
                    "stage": stage,
                    "date": parse_date(date_value, year),
                    "team1": clean_team(cells[team_one_index]),
                    "team2": clean_team(cells[score_index + 1]),
                    "score1": int(score_match.group(1)),
                    "score2": int(score_match.group(2)),
                    "note": note,
                }
            )

    unique = []
    seen = set()
    for match in matches:
        key = (match["date"], match["team1"], match["team2"], match["score1"], match["score2"])
        if key not in seen:
            seen.add(key)
            unique.append(match)
    return unique


def find_events(page_bytes):
    document = html.fromstring(page_bytes.decode("utf-8"))
    events = []
    seen = set()
    for link in document.xpath("//a[starts-with(@href, '/results/')]"):
        label = clean(link.text_content())
        gender_match = re.search(r"\b(Men|Women)\b", label)
        href = link.get("href")
        gender = gender_match.group(1) if gender_match else None
        if gender and gender not in seen:
            seen.add(gender)
            events.append((gender, href))
    return sorted(events, key=lambda item: 0 if item[0] == "Men" else 1)


def disambiguate_final_round(matches, year):
    final_matches = [match for match in matches if match["stage"] == "Final Round"]
    if not final_matches:
        return
    if year in ROUND_ROBIN_MEDAL_YEARS:
        for match in final_matches:
            match["stage"] = "Medal round (round robin)"
        return

    placement_labels = {
        1: ["Gold medal game"],
        2: ["Gold medal game", "Bronze medal game"],
        4: ["Gold medal game", "Bronze medal game", "Fifth-place game", "Seventh-place game"],
        5: ["Gold medal game", "Bronze medal game", "Ninth-place game", "Eleventh-place game", "Thirteenth-place game"],
        6: ["Gold medal game", "Bronze medal game", "Fifth-place game", "Seventh-place game", "Ninth-place game", "Eleventh-place game"],
    }
    labels = placement_labels.get(len(final_matches))
    if not labels:
        raise RuntimeError(f"Unknown final-round format for {year}: {len(final_matches)} matches")
    for match, label in zip(final_matches, labels):
        match["stage"] = label


def main():
    olympics = []
    tournament_count = 0
    match_count = 0

    for year, edition_id, host in EDITIONS:
        sport_page = fetch(f"/editions/{edition_id}/sports/IHO")
        tournaments = []
        for gender, result_path in find_events(sport_page):
            result_page = fetch(result_path)
            matches = parse_matches(result_page, year)
            disambiguate_final_round(matches, year)
            if not matches:
                raise RuntimeError(f"No matches parsed for {year} {gender}: {result_path}")
            tournaments.append({"gender": gender, "matchCount": len(matches), "matches": matches})
            tournament_count += 1
            match_count += len(matches)
            time.sleep(0.35)

        if not tournaments:
            raise RuntimeError(f"No ice hockey tournaments found for {year}")

        olympics.append(
            {
                "year": year,
                "host": host,
                "matchCount": sum(item["matchCount"] for item in tournaments),
                "tournaments": tournaments,
            }
        )
        print(f"{year}: " + ", ".join(f"{item['gender']} {item['matchCount']}" for item in tournaments))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(olympics, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(f"window.OLYMPIC_HOCKEY = {payload};\n", encoding="utf-8")
    print(f"Built {len(olympics)} Olympic Games, {tournament_count} tournaments, and {match_count} matches.")


if __name__ == "__main__":
    main()
