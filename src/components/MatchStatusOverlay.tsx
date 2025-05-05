"use client";

import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchStatusOverlayProps {
  title: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  winner?: string | null;
  onContinue?: () => void;
  buttonText?: string;
}

export default function MatchStatusOverlay({
  title,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  winner = null,
  onContinue,
  buttonText = "Continue",
}: MatchStatusOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {title}
        </h2>

        <div className="flex justify-center items-center gap-4 my-6">
          <div className="text-center">
            <div className="text-lg font-medium">{homeTeam}</div>
            <div className="text-4xl font-bold">{homeScore}</div>
          </div>

          <div className="text-xl font-bold text-gray-400">-</div>

          <div className="text-center">
            <div className="text-lg font-medium">{awayTeam}</div>
            <div className="text-4xl font-bold">{awayScore}</div>
          </div>
        </div>

        {winner && (
          <div
            className={cn(
              "flex items-center justify-center gap-2 p-3 rounded-md mb-6",
              "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
            )}
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">{winner} wins!</span>
          </div>
        )}

        {homeScore === awayScore && title === "FULL TIME" && (
          <div className="text-center font-medium mb-6">
            Match ends in a draw
          </div>
        )}

        {onContinue && (
          <div className="flex justify-center mt-4">
            <Button onClick={onContinue} size="lg">
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
