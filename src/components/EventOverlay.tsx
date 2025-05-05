import type { MatchEvent } from "@/lib/types"
import { Goal, CreditCardIcon as Card, UserMinus, UserPlus, BellIcon as Whistle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventOverlayProps {
  event: MatchEvent
}

export default function EventOverlay({ event }: EventOverlayProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case "goal":
        return <Goal className="w-8 h-8" />
      case "yellowCard":
        return <Card className="w-8 h-8 text-yellow-500 fill-yellow-500" />
      case "redCard":
        return <Card className="w-8 h-8 text-red-500 fill-red-500" />
      case "substitution":
        return (
          <div className="flex flex-col">
            <UserPlus className="w-6 h-6 text-green-500" />
            <UserMinus className="w-6 h-6 text-red-500 -mt-1" />
          </div>
        )
      case "foul":
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
      default:
        return <Whistle className="w-8 h-8" />
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case "goal":
        return "bg-green-500"
      case "yellowCard":
        return "bg-yellow-500"
      case "redCard":
        return "bg-red-500"
      case "substitution":
        return "bg-blue-500"
      case "foul":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={cn(
          "flex items-center gap-4 px-6 py-4 rounded-lg shadow-lg",
          "bg-white dark:bg-gray-800",
          "animate-bounce-in",
        )}
      >
        <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", getEventColor())}>
          {getEventIcon()}
        </div>

        <div>
          <div className="text-lg font-bold">{event.description}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {event.playerName} • {Math.floor(event.time)}&apos;
          </div>
        </div>
      </div>
    </div>
  )
}
