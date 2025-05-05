"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
} from "lucide-react";
import { cn, formatMatchTime } from "@/lib/utils";

interface MatchControlsProps {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  maxTime: number;
  isHalfTime?: boolean;
  isFullTime?: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function MatchControls({
  currentTime,
  isPlaying,
  playbackSpeed,
  maxTime,
  isHalfTime = false,
  isFullTime = false,
  onTimeChange,
  onPlayPause,
  onSpeedChange,
}: MatchControlsProps) {
  const handleSkipBack = () => {
    onTimeChange(Math.max(0, currentTime - 5));
  };

  const handleSkipForward = () => {
    onTimeChange(Math.min(maxTime, currentTime + 5));
  };

  const handleSliderChange = (value: number[]) => {
    onTimeChange(value[0]);
  };

  const handleSpeedChange = () => {
    // Cycle through speeds: 1x -> 2x -> 4x -> 1x
    const newSpeed = playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1;
    onSpeedChange(newSpeed);
  };

  // here, i determine if we're in first half, half time, or second half for display
  const getPeriodDisplay = () => {
    if (isFullTime) return "Full Time";
    if (isHalfTime) return "Half Time";
    if (currentTime >= 45) return "2nd Half";
    return "1st Half";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {formatMatchTime(currentTime)}
        </div>
        <div
          className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            isFullTime
              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              : isHalfTime
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          )}
        >
          {getPeriodDisplay()}
        </div>
        <div className="text-sm font-medium">{playbackSpeed}x</div>
      </div>

      <Slider
        value={[currentTime]}
        min={0}
        max={maxTime}
        step={0.1}
        onValueChange={handleSliderChange}
        className="mb-4"
        disabled={isHalfTime || isFullTime}
      />

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipBack}
          disabled={isHalfTime || isFullTime}
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onTimeChange(Math.max(0, currentTime - 1))}
          disabled={isHalfTime || isFullTime}
        >
          <Rewind className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={onPlayPause}
          disabled={isHalfTime || isFullTime}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onTimeChange(Math.min(maxTime, currentTime + 1))}
          disabled={isHalfTime || isFullTime}
        >
          <FastForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipForward}
          disabled={isHalfTime || isFullTime}
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={handleSpeedChange}
          className="ml-2 text-xs"
          disabled={isHalfTime || isFullTime}
        >
          {playbackSpeed}x
        </Button>
      </div>
    </div>
  );
}
