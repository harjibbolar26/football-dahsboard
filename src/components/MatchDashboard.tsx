"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FootballPitch from "@/components/FootballPitch";
import EventTimeline from "@/components/EventTimeline";
import MatchStats from "@/components/MatchStats";
import MatchControls from "@/components/MatchControls";
import EventOverlay from "@/components/EventOverlay";
import { generateMockMatchData } from "@/lib/MockData";
import type {
  MatchEvent,
  MatchData,
  IMatchStats as MatchStatsType,
} from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import MatchStatusOverlay from "./MatchStatusOverlay";

export default function MatchDashboard() {
  const { setTheme, theme } = useTheme();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEvent, setCurrentEvent] = useState<MatchEvent | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentStats, setCurrentStats] = useState<MatchStatsType | null>(null);
  const [isHalfTime, setIsHalfTime] = useState(false);
  const [isFullTime, setIsFullTime] = useState(false);
  const [isSecondHalf, setIsSecondHalf] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  // Initialize match data
  useEffect(() => {
    const data = generateMockMatchData();
    setMatchData(data);
    setCurrentStats(data.stats);
  }, []);

  // Update stats based on current time
  useEffect(() => {
    if (!matchData) return;

    // Create a copy of the initial stats
    const updatedStats = { ...matchData.stats };

    // Reset score
    updatedStats.score = { home: 0, away: 0 };
    updatedStats.yellowCards = { home: 0, away: 0 };
    updatedStats.redCards = { home: 0, away: 0 };

    // Process all events up to the current time
    matchData.events.forEach((event) => {
      if (event.time <= currentTime) {
        if (event.type === "goal") {
          if (event.teamId === matchData.homeTeam.id) {
            updatedStats.score.home += 1;
          } else {
            updatedStats.score.away += 1;
          }
        } else if (event.type === "yellowCard") {
          if (event.teamId === matchData.homeTeam.id) {
            updatedStats.yellowCards.home += 1;
          } else {
            updatedStats.yellowCards.away += 1;
          }
        } else if (event.type === "redCard") {
          if (event.teamId === matchData.homeTeam.id) {
            updatedStats.redCards.home += 1;
          } else {
            updatedStats.redCards.away += 1;
          }
        }
      }
    });

    // Update possession based on time (simulating slight changes over time)
    const possessionFactor = Math.sin(currentTime / 15) * 5; // Fluctuate by ±5%
    updatedStats.possession = {
      home: Math.max(
        40,
        Math.min(
          60,
          Math.round(matchData.stats.possession.home + possessionFactor)
        )
      ),
      away: Math.max(
        40,
        Math.min(
          60,
          Math.round(matchData.stats.possession.away - possessionFactor)
        )
      ),
    };

    // Update shots and shots on target based on goals and time progression
    const timeProgress = currentTime / 90; // 0 to 1 representing match progress
    updatedStats.shots = {
      home: Math.round(matchData.stats.shots.home * timeProgress),
      away: Math.round(matchData.stats.shots.away * timeProgress),
    };
    updatedStats.shotsOnTarget = {
      home: Math.min(
        updatedStats.shots.home,
        Math.round(matchData.stats.shotsOnTarget.home * timeProgress)
      ),
      away: Math.min(
        updatedStats.shots.away,
        Math.round(matchData.stats.shotsOnTarget.away * timeProgress)
      ),
    };

    // Ensure shots on target is at least equal to goals
    updatedStats.shotsOnTarget.home = Math.max(
      updatedStats.shotsOnTarget.home,
      updatedStats.score.home
    );
    updatedStats.shotsOnTarget.away = Math.max(
      updatedStats.shotsOnTarget.away,
      updatedStats.score.away
    );

    // Update corners and fouls based on time progression
    updatedStats.corners = {
      home: Math.round(matchData.stats.corners.home * timeProgress),
      away: Math.round(matchData.stats.corners.away * timeProgress),
    };
    updatedStats.fouls = {
      home: Math.round(matchData.stats.fouls.home * timeProgress),
      away: Math.round(matchData.stats.fouls.away * timeProgress),
    };

    setCurrentStats(updatedStats);
  }, [currentTime, matchData]);

  // Check for half time and full time
  useEffect(() => {
    // Half time check
    if (currentTime >= 45 && currentTime < 46 && !isHalfTime && !isSecondHalf) {
      setIsHalfTime(true);
      setIsPlaying(false);
    }

    // Full time check
    if (currentTime >= 90 && !isFullTime) {
      setIsFullTime(true);
      setIsPlaying(false);
    }
  }, [currentTime, isHalfTime, isSecondHalf, isFullTime]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isPlaying || !matchData) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 1 * playbackSpeed;

        // Check if we've reached the end of the match
        if (newTime >= 90) {
          setIsPlaying(false);
          setIsFullTime(true);
          return 90;
        }

        // Check for events at this time
        const eventsAtTime = matchData.events.filter(
          (event) => Math.floor(event.time) === Math.floor(newTime)
        );

        if (eventsAtTime.length > 0) {
          setCurrentEvent(eventsAtTime[0]);
          setShowOverlay(true);

          // Switch to timeline tab when an event occurs
          setActiveTab("timeline");

          // Hide overlay after 3 seconds
          setTimeout(() => {
            setShowOverlay(false);
          }, 3000);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, matchData, playbackSpeed]);

  // Get current player positions based on time
  const getCurrentPlayerPositions = () => {
    if (!matchData) return [];

    return matchData.players.map((player) => {
      // Calculate position index based on 30-second intervals (2 positions per minute)
      const positionIndex = Math.min(
        Math.floor(currentTime * 2),
        player.positions.length - 1
      );

      // Get base position
      let x = player.positions[positionIndex].x;
      const y = player.positions[positionIndex].y;

      // If second half, flip the x-coordinates to switch sides
      if (isSecondHalf) {
        x = 100 - x;
      }

      return {
        ...player,
        x,
        y,
      };
    });
  };

  // Get current ball position based on time
  const getCurrentBallPosition = () => {
    if (!matchData) return { x: 50, y: 50 };

    // Calculate position index based on 30-second intervals (2 positions per minute)
    const positionIndex = Math.min(
      Math.floor(currentTime * 2),
      matchData.ballPositions.length - 1
    );

    // Get base position
    let x = matchData.ballPositions[positionIndex].x;
    const y = matchData.ballPositions[positionIndex].y;

    // If second half, flip the x-coordinates to switch sides
    if (isSecondHalf) {
      x = 100 - x;
    }

    return { x, y };
  };

  // Handle continuing to second half
  const handleContinueToSecondHalf = () => {
    setIsHalfTime(false);
    setIsSecondHalf(true);
    setCurrentTime(45);
    setIsPlaying(true);
  };

  if (!matchData || !currentStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {matchData.homeTeam.name} vs {matchData.awayTeam.name}
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Live Match Visualization
        </p>
        <div className="text-center text-xl font-bold mt-2">
          {currentStats.score.home} - {currentStats.score.away}
        </div>
      </div>

      <div className="relative mb-6">
        <FootballPitch
          players={getCurrentPlayerPositions()}
          ballPosition={getCurrentBallPosition()}
          homeTeam={matchData.homeTeam}
          awayTeam={matchData.awayTeam}
          isSecondHalf={isSecondHalf}
        />

        {showOverlay && currentEvent && <EventOverlay event={currentEvent} />}

        {isHalfTime && (
          <MatchStatusOverlay
            title="HALF TIME"
            homeScore={currentStats.score.home}
            awayScore={currentStats.score.away}
            homeTeam={matchData.homeTeam.name}
            awayTeam={matchData.awayTeam.name}
            onContinue={handleContinueToSecondHalf}
            buttonText="Start Second Half"
          />
        )}

        {isFullTime && (
          <MatchStatusOverlay
            title="FULL TIME"
            homeScore={currentStats.score.home}
            awayScore={currentStats.score.away}
            homeTeam={matchData.homeTeam.name}
            awayTeam={matchData.awayTeam.name}
            winner={
              currentStats.score.home > currentStats.score.away
                ? matchData.homeTeam.name
                : currentStats.score.away > currentStats.score.home
                ? matchData.awayTeam.name
                : null
            }
          />
        )}
      </div>

      <MatchControls
        currentTime={currentTime}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onTimeChange={setCurrentTime}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setPlaybackSpeed}
        maxTime={90}
        isHalfTime={isHalfTime}
        isFullTime={isFullTime}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="stats">Match Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-2">
          <EventTimeline
            events={matchData.events}
            currentTime={currentTime}
            onEventClick={(time) => {
              setCurrentTime(time);
              setIsPlaying(false);
              // If we're jumping to second half
              if (time >= 45 && !isSecondHalf) {
                setIsSecondHalf(true);
                setIsHalfTime(false);
              }
            }}
          />
        </TabsContent>
        <TabsContent value="stats" className="mt-2">
          <MatchStats
            homeTeam={matchData.homeTeam}
            awayTeam={matchData.awayTeam}
            stats={currentStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
