import type { MatchEvent } from "@/lib/types";
import {
  Goal,
  CreditCardIcon as Card,
  UserMinus,
  UserPlus,
  BellIcon as Whistle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventOverlayProps {
  event: MatchEvent;
}

export default function EventOverlay({ event }: EventOverlayProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case "goal":
        return <Goal className="sm:w-8 sm:h-8 w-4 h-4" />;
      case "yellowCard":
        return <Card className="sm:w-8 sm:h-8 w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case "redCard":
        return <Card className="sm:w-8 sm:h-8 w-4 h-4 text-red-500 fill-red-500" />;
      case "substitution":
        return (
          <div className="flex sm:flex-col flex-row max-sm:items-center gap-1">
            <UserPlus className="sm:w-6 sm:h-6 w-3 h-3 text-green-500" />
            <UserMinus className="sm:w-6 sm:h-6 w-3 h-3 text-red-500 -mt-1" />
          </div>
        );
      case "foul":
        return <AlertTriangle className="sm:w-8 sm:h-8 w-4 h-4 text-yellow-500" />;
      default:
        return <Whistle className="sm:w-8 sm:h-8 w-4 h-4" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case "goal":
        return "bg-green-500";
      case "yellowCard":
        return "bg-yellow-500";
      case "redCard":
        return "bg-red-500";
      case "substitution":
        return "bg-blue-500";
      case "foul":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={cn(
          "flex sm:flex-row flex-col items-center sm:gap-4 gap-3 px-6 py-4 rounded-lg shadow-lg",
          "bg-white dark:bg-gray-800",
          "animate-bounce-in"
        )}
      >
        <div
          className={cn(
            "sm:w-14 w-10 sm:h-14 h-10 rounded-full flex items-center justify-center",
            getEventColor()
          )}
        >
          {getEventIcon()}
        </div>

        <div>
          <div className="sm:text-lg text-base font-bold">
            {event.description}
          </div>
          <div className="sm:text-sm text-xs text-gray-500 dark:text-gray-400">
            {event.playerName} • {Math.floor(event.time)}&apos;
          </div>
        </div>
      </div>
    </div>
  );
}
