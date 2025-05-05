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
import { formatMatchTime } from "@/lib/utils";

interface MatchControlsProps {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  maxTime: number;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function MatchControls({
  currentTime,
  isPlaying,
  playbackSpeed,
  maxTime,
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {formatMatchTime(currentTime)}
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
      />

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleSkipBack}>
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onTimeChange(Math.max(0, currentTime - 1))}
        >
          <Rewind className="h-4 w-4" />
        </Button>

        <Button variant="default" size="icon" onClick={onPlayPause}>
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
        >
          <FastForward className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleSkipForward}>
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={handleSpeedChange}
          className="ml-2 text-xs"
        >
          {playbackSpeed}x
        </Button>
      </div>
    </div>
  );
}
