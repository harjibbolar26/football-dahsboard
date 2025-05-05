"use client";

import { useState } from "react";
import type { Player, Team } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FootballPitchProps {
  players: (Player & { x: number; y: number })[];
  ballPosition: { x: number; y: number };
  homeTeam: Team;
  awayTeam: Team;
  isSecondHalf?: boolean
}

export default function FootballPitch({
    players,
    ballPosition,
    homeTeam,
    awayTeam,
    isSecondHalf = false,
  }: FootballPitchProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  
    // here, i calculate the aspect ratio of a regular football pitch (typically around 105x68 meters)
    const aspectRatio = 105 / 68
  
    // In second half, i swapped the team indicators
    const leftTeam = isSecondHalf ? awayTeam : homeTeam
    const rightTeam = isSecondHalf ? homeTeam : awayTeam
  
    return (
      <div
        className="relative w-full bg-green-700 dark:bg-green-900 rounded-lg overflow-hidden shadow-lg transition-colors duration-300"
        style={{ aspectRatio: aspectRatio }}
      >
        {/* for pitch markings */}
        <svg viewBox="0 0 105 68" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* for outer boundary */}
          <rect x="0" y="0" width="105" height="68" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for center line */}
          <line x1="52.5" y1="0" x2="52.5" y2="68" stroke="white" strokeWidth="0.3" />
  
          {/* for center circle */}
          <circle cx="52.5" cy="34" r="9.15" fill="none" stroke="white" strokeWidth="0.3" />
          <circle cx="52.5" cy="34" r="0.3" fill="white" />
  
          {/* for left penalty area */}
          <rect x="0" y="13.84" width="16.5" height="40.32" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for left goal area */}
          <rect x="0" y="24.84" width="5.5" height="18.32" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for left penalty spot */}
          <circle cx="11" cy="34" r="0.3" fill="white" />
  
          {/* for left penalty arc */}
          <path d="M 16.5,25.3 A 9.15,9.15 0 0 1 16.5,42.7" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for right penalty area */}
          <rect x="88.5" y="13.84" width="16.5" height="40.32" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for right goal area */}
          <rect x="99.5" y="24.84" width="5.5" height="18.32" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for right penalty spot */}
          <circle cx="94" cy="34" r="0.3" fill="white" />
  
          {/* for right penalty arc */}
          <path d="M 88.5,25.3 A 9.15,9.15 0 0 0 88.5,42.7" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for corner arcs */}
          <path d="M 0,1 A 1,1 0 0 1 1,0" fill="none" stroke="white" strokeWidth="0.3" />
          <path d="M 104,1 A 1,1 0 0 0 105,0" fill="none" stroke="white" strokeWidth="0.3" />
          <path d="M 0,67 A 1,1 0 0 0 1,68" fill="none" stroke="white" strokeWidth="0.3" />
          <path d="M 104,67 A 1,1 0 0 1 105,68" fill="none" stroke="white" strokeWidth="0.3" />
  
          {/* for goal nets */}
          {/* for the left goal */}
          <rect x="-2" y="29" width="2" height="10" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="0.2" />
          <line x1="0" y1="29" x2="-2" y2="29" stroke="white" strokeWidth="0.2" />
          <line x1="0" y1="39" x2="-2" y2="39" stroke="white" strokeWidth="0.2" />
  
          {/* Goal net pattern - left goal */}
          <pattern id="goalNetLeft" patternUnits="userSpaceOnUse" width="0.5" height="0.5">
            <path d="M0,0 L0.5,0.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.05" />
            <path d="M0.5,0 L0,0.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.05" />
          </pattern>
          <rect x="-2" y="29" width="2" height="10" fill="url(#goalNetLeft)" />
  
          {/* for the right goal */}
          <rect x="105" y="29" width="2" height="10" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="0.2" />
          <line x1="105" y1="29" x2="107" y2="29" stroke="white" strokeWidth="0.2" />
          <line x1="105" y1="39" x2="107" y2="39" stroke="white" strokeWidth="0.2" />
  
          {/* Goal net pattern - right goal */}
          <pattern id="goalNetRight" patternUnits="userSpaceOnUse" width="0.5" height="0.5">
            <path d="M0,0 L0.5,0.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.05" />
            <path d="M0.5,0 L0,0.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.05" />
          </pattern>
          <rect x="105" y="29" width="2" height="10" fill="url(#goalNetRight)" />
  
          {/* for goal lines */}
          <line x1="0" y1="29" x2="0" y2="39" stroke="white" strokeWidth="1" />
          <line x1="105" y1="29" x2="105" y2="39" stroke="white" strokeWidth="1" />
        </svg>
  
        {/* for players */}
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out",
              "flex flex-col items-center justify-center",
              selectedPlayer?.id === player.id ? "z-20" : "z-10",
            )}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
            }}
            onClick={() => setSelectedPlayer(player)}
          >
            <div
              className={cn(
                "rounded-full flex items-center justify-center text-xs font-bold text-white",
                "transition-all duration-300 ease-in-out shadow-md",
                player.teamId === homeTeam.id ? "bg-blue-600" : "bg-red-600",
                selectedPlayer?.id === player.id ? "w-8 h-8 md:w-10 md:h-10" : "w-6 h-6 md:w-8 md:h-8",
              )}
            >
              {player.number}
            </div>
            {selectedPlayer?.id === player.id && (
              <div className="absolute -bottom-6 bg-black/80 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {player.name}
              </div>
            )}
          </div>
        ))}
  
        {/* for the ball */}
        <div
          className="absolute w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-md z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
          }}
        />
  
        {/* for the team indicators */}
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          <div className={cn("w-3 h-3 rounded-full", leftTeam.id === homeTeam.id ? "bg-blue-600" : "bg-red-600")}></div>
          <span>{leftTeam.name}</span>
        </div>
  
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          <span>{rightTeam.name}</span>
          <div className={cn("w-3 h-3 rounded-full", rightTeam.id === homeTeam.id ? "bg-blue-600" : "bg-red-600")}></div>
        </div>
      </div>
    )
  }