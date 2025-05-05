"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FootballPitch from "@/components/FootballPitch";
import EventTimeline from "@/components/EventTimeline";
import MatchStats from "@/components/MatchStats";
import MatchControls from "@/components/MatchControls";
import EventOverlay from "@/components/EventOverlay";
import { generateMockMatchData } from "@/lib/MockData";
import type { MatchEvent, MatchData, IMatchStats } from "@/lib/types";

export default function MatchDashboard() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEvent, setCurrentEvent] = useState<MatchEvent | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentStats, setCurrentStats] = useState<IMatchStats | null>(null);

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

  // Simulate real-time updates
  useEffect(() => {
    if (!isPlaying || !matchData) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 1 * playbackSpeed;

        // Check if we've reached the end of the match
        if (newTime >= 90) {
          setIsPlaying(false);
          return 90;
        }

        // Check for events at this time
        const eventsAtTime = matchData.events.filter(
          (event) => Math.floor(event.time) === Math.floor(newTime)
        );

        if (eventsAtTime.length > 0) {
          setCurrentEvent(eventsAtTime[0]);
          setShowOverlay(true);

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

      return {
        ...player,
        x: player.positions[positionIndex].x,
        y: player.positions[positionIndex].y,
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

    return matchData.ballPositions[positionIndex];
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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {matchData.homeTeam.name} vs {matchData.awayTeam.name}
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
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
        />

        {showOverlay && currentEvent && <EventOverlay event={currentEvent} />}
      </div>

      <MatchControls
        currentTime={currentTime}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onTimeChange={setCurrentTime}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setPlaybackSpeed}
        maxTime={90}
      />

      <Tabs defaultValue="timeline" className="mt-6">
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
