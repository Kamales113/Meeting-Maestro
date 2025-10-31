
'use client';
import { useRooms, useAllBookings } from "@/lib/data";
import DailyCalendarView from "@/components/daily-calendar-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { bookings, isLoading: bookingsLoading } = useAllBookings();

  if (roomsLoading || bookingsLoading || !rooms || !bookings) {
    return (
      <div className="flex-1 flex flex-col h-full">
         <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
             <div className="mb-8">
                 <Skeleton className="h-8 w-64 mb-2" />
                 <Skeleton className="h-4 w-96" />
             </div>
             <Skeleton className="h-[70vh] w-full" />
         </div>
     </div>
    )
  }

  return (
     <div className="flex-1 flex flex-col h-full">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Daily Schedule</h1>
                <p className="text-muted-foreground">View all room bookings for the day at a glance.</p>
            </div>
            <DailyCalendarView rooms={rooms} allBookings={bookings} />
        </div>
    </div>
  );
}
