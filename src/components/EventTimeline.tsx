"use client";

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

interface EventTimelineProps {
  events: MatchEvent[];
  currentTime: number;
  onEventClick: (time: number) => void;
}

export default function EventTimeline({ events, currentTime, onEventClick }: EventTimelineProps) {
    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => a.time - b.time)
  
    // Group events by 15-minute intervals
    const timeIntervals = [
      { label: "1st Half", start: 0, end: 45 },
      { label: "2nd Half", start: 45, end: 90 },
    ]
  
    const getEventIcon = (type: string) => {
      switch (type) {
        case "goal":
          return <Goal className="w-5 h-5" />
        case "yellowCard":
          return <Card className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        case "redCard":
          return <Card className="w-5 h-5 text-red-500 fill-red-500" />
        case "substitution":
          return (
            <div className="flex flex-col">
              <UserPlus className="w-4 h-4 text-green-500" />
              <UserMinus className="w-4 h-4 text-red-500 -mt-1" />
            </div>
          )
        case "foul":
          return <AlertTriangle className="w-5 h-5 text-yellow-500" />
        default:
          return <Whistle className="w-5 h-5" />
      }
    }
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Match Timeline</h3>
  
        <div className="space-y-6">
          {timeIntervals.map((interval) => {
            const intervalEvents = sortedEvents.filter(
              (event) => event.time >= interval.start && event.time <= interval.end,
            )
  
            if (intervalEvents.length === 0) return null
  
            return (
              <div key={interval.label} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">{interval.label}</h4>
  
                <div className="relative">
                  {/* Timeline track */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
  
                  {/* Events */}
                  <div className="space-y-3">
                    {intervalEvents.map((event) => (
                      <div
                        key={`${event.type}-${event.time}-${event.playerId}`}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer",
                          "hover:bg-gray-100 dark:hover:bg-gray-700",
                          currentTime >= event.time && "bg-gray-50 dark:bg-gray-800",
                        )}
                        onClick={() => onEventClick(event.time)}
                      >
                        <div className="relative flex items-center justify-center">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              "bg-gray-100 dark:bg-gray-700",
                              currentTime >= event.time && "bg-primary/10",
                            )}
                          >
                            {getEventIcon(event.type)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-600 text-xs font-medium px-1 rounded">
                            {Math.floor(event.time)}&apos;
                          </div>
                        </div>
  
                        <div className="flex-1">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.playerName} {event.teamName && `• ${event.teamName}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
