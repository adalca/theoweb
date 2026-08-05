$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $root "nhl\data"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$gamesUri = "https://api.nhle.com/stats/rest/en/game?isAggregate=false&isGame=true&start=0&limit=100000"
$teamsUri = "https://api.nhle.com/stats/rest/en/team?isAggregate=false&isGame=false&start=0&limit=200"

$games = (Invoke-RestMethod -Uri $gamesUri).data
$teams = (Invoke-RestMethod -Uri $teamsUri).data
$teamNames = @{}
foreach ($team in $teams) {
  $decodedName = [Text.Encoding]::UTF8.GetString([Text.Encoding]::GetEncoding(1252).GetBytes($team.fullName))
  $teamNames[[int]$team.id] = $decodedName
}

$seasons = @()
$eligibleGames = $games | Where-Object {
  ($_.gameType -eq 2 -or $_.gameType -eq 3) -and
  $null -ne $_.homeScore -and
  $null -ne $_.visitingScore -and
  $_.gameStateId -eq 7
}

foreach ($group in ($eligibleGames | Group-Object season | Sort-Object { [int]$_.Name } -Descending)) {
  $seasonId = [int]$group.Name
  $seasonGames = @($group.Group | Sort-Object gameDate, id | ForEach-Object {
    [ordered]@{
      id = [int]$_.id
      type = if ($_.gameType -eq 3) { "Playoffs" } else { "Regular season" }
      date = $_.gameDate
      home = $teamNames[[int]$_.homeTeamId]
      away = $teamNames[[int]$_.visitingTeamId]
      homeScore = [int]$_.homeScore
      awayScore = [int]$_.visitingScore
    }
  })

  $seasonText = [string]$seasonId
  $startYear = [int]$seasonText.Substring(0, 4)
  $endYear = [int]$seasonText.Substring(4, 4)
  $label = "$startYear-$($endYear.ToString().Substring(2))"
  $seasonObject = [ordered]@{
    id = $seasonId
    label = $label
    gameCount = $seasonGames.Count
    regularSeasonCount = @($seasonGames | Where-Object { $_.type -eq "Regular season" }).Count
    playoffCount = @($seasonGames | Where-Object { $_.type -eq "Playoffs" }).Count
    games = $seasonGames
  }

  $seasonJson = $seasonObject | ConvertTo-Json -Depth 6 -Compress
  $seasonPath = Join-Path $outputDirectory "$seasonId.js"
  [IO.File]::WriteAllText($seasonPath, "window.NHL_SEASON = $seasonJson;`n", [Text.UTF8Encoding]::new($false))

  $seasons += [ordered]@{
    id = $seasonId
    label = $label
    gameCount = $seasonGames.Count
    regularSeasonCount = $seasonObject.regularSeasonCount
    playoffCount = $seasonObject.playoffCount
  }
}

$manifestJson = $seasons | ConvertTo-Json -Depth 4 -Compress
[IO.File]::WriteAllText((Join-Path $root "nhl\seasons.js"), "window.NHL_SEASONS = $manifestJson;`n", [Text.UTF8Encoding]::new($false))

$totalGames = 0
foreach ($season in $seasons) { $totalGames += [int]$season.gameCount }
Write-Output "Built $($seasons.Count) NHL seasons with $totalGames completed games."
