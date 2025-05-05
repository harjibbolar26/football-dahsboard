import type { Team, IMatchStats as MatchStatsType } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface MatchStatsProps {
  homeTeam: Team;
  awayTeam: Team;
  stats: MatchStatsType;
}

interface MatchStatsProps {
  homeTeam: Team;
  awayTeam: Team;
  stats: MatchStatsType;
}

export default function MatchStats({
  homeTeam,
  awayTeam,
  stats,
}: MatchStatsProps) {
  const statItems = [
    {
      label: "Possession",
      home: stats.possession.home,
      away: stats.possession.away,
    },
    { label: "Shots", home: stats.shots.home, away: stats.shots.away },
    {
      label: "Shots on Target",
      home: stats.shotsOnTarget.home,
      away: stats.shotsOnTarget.away,
    },
    { label: "Corners", home: stats.corners.home, away: stats.corners.away },
    { label: "Fouls", home: stats.fouls.home, away: stats.fouls.away },
    {
      label: "Yellow Cards",
      home: stats.yellowCards.home,
      away: stats.yellowCards.away,
    },
    {
      label: "Red Cards",
      home: stats.redCards.home,
      away: stats.redCards.away,
    },
    { label: "Offsides", home: stats.offsides.home, away: stats.offsides.away },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Match Statistics</h3>

      <div className="grid grid-cols-3 text-center mb-4">
        <div className="font-medium">{homeTeam.name}</div>
        <div className="text-gray-500 dark:text-gray-400">vs</div>
        <div className="font-medium">{awayTeam.name}</div>
      </div>

      <div className="space-y-4">
        {statItems.map((item) => {
          const total = item.home + item.away;
          const homePercent = total > 0 ? (item.home / total) * 100 : 50;

          return (
            <div key={item.label} className="space-y-1">
              <div className="grid grid-cols-3 text-sm">
                <div className="text-right font-medium">{item.home}</div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {item.label}
                </div>
                <div className="text-left font-medium">{item.away}</div>
              </div>

              <Progress value={homePercent} className="h-2" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium mb-2">Score</h4>
        <div className="grid grid-cols-3 text-center">
          <div className="text-2xl font-bold">{stats.score.home}</div>
          <div className="text-gray-500 dark:text-gray-400">-</div>
          <div className="text-2xl font-bold">{stats.score.away}</div>
        </div>
      </div>
    </div>
  );
}
