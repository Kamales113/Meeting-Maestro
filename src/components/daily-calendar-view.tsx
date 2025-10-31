
"use client";

import { useState } from "react";
import { format, startOfDay, addDays, eachMinuteOfInterval, isSameDay, set, getMinutes, differenceInMinutes } from "date-fns";
import { Room, Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDateTimeRange } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { WithId } from "@/firebase";

const timeSlots = eachMinuteOfInterval({ start: set(new Date(), { hours: 8, minutes: 0 }), end: set(new Date(), { hours: 18, minutes: 0 }) }, { step: 30 });
const ROW_HEIGHT = 40; // in pixels

const CalendarGrid = ({ rooms, bookings, selectedDate }: { rooms: WithId<Room>[], bookings: WithId<Booking>[], selectedDate: Date }) => {
  const dailyBookings = bookings.filter(b => isSameDay(b.startTime as Date, selectedDate));

  const getBookingStyle = (booking: WithId<Booking>) => {
    const startTime = booking.startTime as Date;
    const endTime = booking.endTime as Date;
    const top = differenceInMinutes(startTime, startOfDay(startTime)) - (8 * 60); // minutes from 8am
    const duration = differenceInMinutes(endTime, startTime);
    return {
      top: `${(top / 30) * ROW_HEIGHT}px`,
      height: `${(duration / 30) * ROW_HEIGHT}px`,
    };
  };

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
    <div className="grid grid-cols-[auto_1fr] flex-1">
      {/* Header */}
      <div className="col-start-2 grid" style={{ gridTemplateColumns: `repeat(${rooms.length}, minmax(0, 1fr))` }}>
        {rooms.map((room) => (
          <div key={room.id} className="text-center font-semibold p-2 border-b border-l">
            {room.name}
          </div>
        ))}
      </div>

      <div className="row-start-2 col-start-1 -mt-2.5">
        {timeSlots.map(time => (
          (getMinutes(time) === 0) && (
            <div key={time.toISOString()} className="relative text-right pr-2" style={{ height: ROW_HEIGHT * 2}}>
              <span className="text-xs text-muted-foreground">{format(time, 'h a')}</span>
            </div>
          )
        ))}
      </div>
      
      <div className="row-start-2 col-start-2 grid relative overflow-auto" style={{ gridTemplateColumns: `repeat(${rooms.length}, minmax(0, 1fr))` }}>
        {/* Time slot lines */}
        <div className="row-start-1 col-span-full grid-rows-[repeat(21,minmax(0,1fr))] w-full h-full">
            {timeSlots.map(time => (
            <div key={time.toISOString()} className="border-t" style={{ height: `${ROW_HEIGHT}px` }}></div>
            ))}
        </div>

        {/* Room columns */}
        {rooms.map((room, i) => (
          <div key={room.id} className={cn("row-start-1 col-start-1 col-span-1 row-span-full", i > 0 && "border-l")} style={{ gridColumnStart: i + 1 }}></div>
        ))}

        {/* Bookings */}
        {dailyBookings.map((booking) => {
          const roomIndex = rooms.findIndex(r => r.id === booking.roomId);
          if (roomIndex === -1) return null;

          return (
            <Popover key={booking.id}>
              <PopoverTrigger asChild>
                <div
                  className="absolute p-2 rounded-lg bg-primary/20 border border-primary/50 text-primary-foreground text-xs overflow-hidden cursor-pointer hover:bg-primary/30"
                  style={{
                    ...getBookingStyle(booking),
                    gridColumnStart: roomIndex + 1,
                    width: 'calc(100% - 8px)',
                    left: '4px'
                  }}
                >
                  <p className="font-bold truncate">{booking.title}</p>
                  <p className="truncate">{format(booking.startTime as Date, 'h:mm a')} - {format(booking.endTime as Date, 'h:mm a')}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium leading-none">{booking.title}</h4>
                        <p className="text-sm text-muted-foreground">in {rooms[roomIndex].name}</p>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{formatDateTimeRange(booking.startTime as Date, booking.endTime as Date)}</span>
                    </div>
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={booking.userImage} />
                            <AvatarFallback>{booking.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{booking.userName}</span>
                    </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
    </Card>
  );
};

export default function DailyCalendarView({ rooms, allBookings }: { rooms: WithId<Room>[]; allBookings: WithId<Booking>[] }) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

  const handleDateChange = (date: Date | undefined) => {
    if (date) setSelectedDate(startOfDay(date));
  };

  const prevDay = () => setSelectedDate(prev => addDays(prev, -1));
  const nextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToToday = () => setSelectedDate(startOfDay(new Date()));

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={prevDay}><ChevronLeft className="h-4 w-4" /></Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-64 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={nextDay}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <Button onClick={goToToday}>Today</Button>
      </div>
      <CalendarGrid rooms={rooms} bookings={allBookings} selectedDate={selectedDate} />
    </div>
  );
}
