export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
  positions: { x: number; y: number }[];
}

export interface MatchEvent {
  id: string;
  type: string;
  time: number;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName?: string;
  description: string;
}

export interface IMatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  score: { home: number; away: number };
}

export interface MatchData {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  players: Player[];
  events: MatchEvent[];
  ballPositions: { x: number; y: number }[];
  stats: IMatchStats;
}
