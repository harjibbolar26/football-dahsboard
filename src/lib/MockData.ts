import type { MatchData, Player, MatchEvent } from "@/lib/types";
import { randomBetween } from "@/lib/utils";

// Modify the generatePlayerPositions function to keep goalkeepers near their goal
function generatePlayerPositions(
  isHomeTeam: boolean,
  position: string
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const numPositions = 180; // 90 minutes / 0.5 = 180 position updates (every 30 seconds)

  // Set initial position based on player role and team
  let baseX = isHomeTeam ? 30 : 70;
  let baseY = 50;

  // Adjust base position based on player role
  switch (position) {
    case "GK":
      baseX = isHomeTeam ? 5 : 95;
      break;
    case "DEF":
      baseX = isHomeTeam ? 20 : 80;
      break;
    case "MID":
      baseX = isHomeTeam ? 40 : 60;
      break;
    case "FWD":
      baseX = isHomeTeam ? 60 : 40;
      break;
  }

  // Randomize Y position based on position
  if (position === "DEF" || position === "MID" || position === "FWD") {
    if (position === "DEF" || position === "FWD") {
      // Spread defenders and forwards across the width of the pitch
      baseY = randomBetween(20, 80);
    } else {
      // Midfielders more central
      baseY = randomBetween(30, 70);
    }
  }

  // Generate positions with some randomness
  for (let i = 0; i < numPositions; i++) {
    // Add some random movement around the base position
    // Make smaller movements since updates are more frequent
    let xVariation = randomBetween(-5, 5);
    let yVariation = randomBetween(-5, 5);

    // If goalkeeper, severely restrict movement
    if (position === "GK") {
      xVariation = randomBetween(-2, 2);
      yVariation = randomBetween(-8, 8);
    }

    // If not first position, base movement on previous position for smoother transitions
    const prevX = i > 0 ? positions[i - 1].x : baseX;
    const prevY = i > 0 ? positions[i - 1].y : baseY;

    // Ensure positions stay within the pitch and have some continuity
    let x = Math.max(1, Math.min(99, prevX + xVariation));
    let y = Math.max(1, Math.min(99, prevY + yVariation));

    // Additional constraints for goalkeepers to keep them near their goal
    if (position === "GK") {
      if (isHomeTeam) {
        x = Math.max(1, Math.min(10, x)); // Home goalkeeper stays in left 10% of pitch
      } else {
        x = Math.max(90, Math.min(99, x)); // Away goalkeeper stays in right 10% of pitch
      }
      y = Math.max(25, Math.min(75, y)); // Keep goalkeepers centered vertically
    }

    positions.push({ x, y });
  }

  return positions;
}

// Modify the generateBallPositions function to create special paths for goals
function generateBallPositions(
  events: MatchEvent[]
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const numPositions = 180; // 90 minutes / 0.5 = 180 position updates (every 30 seconds)

  // Start in the center
  let currentX = 50;
  let currentY = 50;

  // Create a map of goal events by time index
  const goalEvents = events
    .filter((event) => event.type === "goal")
    .reduce((map, event) => {
      const timeIndex = Math.floor(event.time * 2); // Convert to 30-second intervals
      map[timeIndex] = event;
      return map;
    }, {} as Record<number, MatchEvent>);

  for (let i = 0; i < numPositions; i++) {
    // Check if there's a goal at this time index
    const goalEvent = goalEvents[i];

    if (goalEvent) {
      // Determine which goal (left or right)
      const isHomeGoal = goalEvent.teamId === "team1"; // Home team scoring means ball goes to right goal

      // Create a path to the goal over the next few positions
      const goalX = isHomeGoal ? 99 : 1; // Target X position (goal line)
      const goalY = randomBetween(40, 60); // Random Y position within goal height

      // Set the ball position to be near the goal
      currentX = isHomeGoal ? 90 : 10;
      currentY = randomBetween(35, 65);

      // Add the current position
      positions.push({ x: currentX, y: currentY });

      // Add positions leading to the goal (for the next 2-3 updates)
      if (i + 1 < numPositions) {
        positions.push({ x: isHomeGoal ? 95 : 5, y: goalY });
        i++;
      }

      if (i + 1 < numPositions) {
        positions.push({ x: goalX, y: goalY });
        i++;
      }

      // After goal, reset to center for kickoff
      if (i + 1 < numPositions) {
        positions.push({ x: 50, y: 50 });
        i++;
      }

      // Continue with normal movement from the center
      currentX = 50;
      currentY = 50;
    } else {
      // Normal random movement
      const xChange = randomBetween(-8, 8);
      const yChange = randomBetween(-6, 6);

      // Ensure positions stay within the pitch
      currentX = Math.max(1, Math.min(99, currentX + xChange));
      currentY = Math.max(1, Math.min(99, currentY + yChange));

      positions.push({ x: currentX, y: currentY });
    }
  }

  return positions;
}

// Update the generateMockMatchData function to use PSG vs Arsenal
export function generateMockMatchData(): MatchData {
  // Define teams - PSG (home) vs Arsenal (away)
  const homeTeam = {
    id: "team1",
    name: "PSG",
    shortName: "PSG",
    color: "blue",
  };

  const awayTeam = {
    id: "team2",
    name: "Arsenal",
    shortName: "ARS",
    color: "red",
  };

  // Define players - PSG
  const homePlayers: Player[] = [
    {
      id: "h1",
      name: "Donnarumma",
      number: 1,
      position: "GK",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h2",
      name: "Hakimi",
      number: 2,
      position: "DEF",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h3",
      name: "Marquinhos",
      number: 5,
      position: "DEF",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h4",
      name: "Skriniar",
      number: 37,
      position: "DEF",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h5",
      name: "Mendes",
      number: 25,
      position: "DEF",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h6",
      name: "Vitinha",
      number: 17,
      position: "MID",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h7",
      name: "Zaire-Emery",
      number: 33,
      position: "MID",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h8",
      name: "Ruiz",
      number: 8,
      position: "MID",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h9",
      name: "Dembélé",
      number: 10,
      position: "FWD",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h10",
      name: "Mbappé",
      number: 7,
      position: "FWD",
      teamId: homeTeam.id,
      positions: [],
    },
    {
      id: "h11",
      name: "Asensio",
      number: 11,
      position: "FWD",
      teamId: homeTeam.id,
      positions: [],
    },
  ];

  // Define players - Arsenal
  const awayPlayers: Player[] = [
    {
      id: "a1",
      name: "Raya",
      number: 1,
      position: "GK",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a2",
      name: "White",
      number: 4,
      position: "DEF",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a3",
      name: "Saliba",
      number: 2,
      position: "DEF",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a4",
      name: "Gabriel",
      number: 6,
      position: "DEF",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a5",
      name: "Timber",
      number: 12,
      position: "DEF",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a6",
      name: "Partey",
      number: 5,
      position: "MID",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a7",
      name: "Rice",
      number: 41,
      position: "MID",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a8",
      name: "Ødegaard",
      number: 8,
      position: "MID",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a9",
      name: "Saka",
      number: 7,
      position: "FWD",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a10",
      name: "Havertz",
      number: 29,
      position: "FWD",
      teamId: awayTeam.id,
      positions: [],
    },
    {
      id: "a11",
      name: "Martinelli",
      number: 11,
      position: "FWD",
      teamId: awayTeam.id,
      positions: [],
    },
  ];

  // Generate events - Arsenal winning 4-2 with goals by Saka (2), Rice, and Martinelli
  const events: MatchEvent[] = [
    {
      id: "e1",
      type: "goal",
      time: 18.5,
      playerId: "a9",
      playerName: "Saka",
      teamId: awayTeam.id,
      teamName: awayTeam.name,
      description: "GOAL! Saka scores for Arsenal!",
    },
    {
      id: "e2",
      type: "yellowCard",
      time: 27.2,
      playerId: "h6",
      playerName: "Vitinha",
      teamId: homeTeam.id,
      teamName: homeTeam.name,
      description: "Yellow Card",
    },
    {
      id: "e3",
      type: "goal",
      time: 35.1,
      playerId: "h10",
      playerName: "Mbappé",
      teamId: homeTeam.id,
      teamName: homeTeam.name,
      description: "GOAL! Mbappé equalizes for PSG!",
    },
    {
      id: "e4",
      type: "goal",
      time: 42.3,
      playerId: "a7",
      playerName: "Rice",
      teamId: awayTeam.id,
      teamName: awayTeam.name,
      description: "GOAL! Rice puts Arsenal ahead!",
    },
    {
      id: "e5",
      type: "substitution",
      time: 46.0,
      playerId: "h8",
      playerName: "Ruiz → Lee",
      teamId: homeTeam.id,
      teamName: homeTeam.name,
      description: "Substitution",
    },
    {
      id: "e6",
      type: "goal",
      time: 58.7,
      playerId: "h9",
      playerName: "Dembélé",
      teamId: homeTeam.id,
      teamName: homeTeam.name,
      description: "GOAL! Dembélé equalizes again for PSG!",
    },
    {
      id: "e7",
      type: "goal",
      time: 67.4,
      playerId: "a9",
      playerName: "Saka",
      teamId: awayTeam.id,
      teamName: awayTeam.name,
      description: "GOAL! Saka scores his second!",
    },
    {
      id: "e8",
      type: "redCard",
      time: 75.5,
      playerId: "h4",
      playerName: "Skriniar",
      teamId: homeTeam.id,
      teamName: homeTeam.name,
      description: "Red Card",
    },
    {
      id: "e9",
      type: "goal",
      time: 84.2,
      playerId: "a11",
      playerName: "Martinelli",
      teamId: awayTeam.id,
      teamName: awayTeam.name,
      description: "GOAL! Martinelli seals it for Arsenal!",
    },
  ];

  // Generate player positions
  homePlayers.forEach((player) => {
    player.positions = generatePlayerPositions(true, player.position);
  });

  awayPlayers.forEach((player) => {
    player.positions = generatePlayerPositions(false, player.position);
  });

  // Generate match stats - Arsenal winning 4-2
  const stats = {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 15 },
    shotsOnTarget: { home: 5, away: 9 },
    corners: { home: 6, away: 7 },
    fouls: { home: 14, away: 8 },
    yellowCards: { home: 3, away: 1 },
    redCards: { home: 1, away: 0 },
    offsides: { home: 2, away: 3 },
    score: { home: 2, away: 4 },
  };

  return {
    id: "match1",
    homeTeam,
    awayTeam,
    players: [...homePlayers, ...awayPlayers],
    events,
    ballPositions: generateBallPositions(events),
    stats,
  };
}
