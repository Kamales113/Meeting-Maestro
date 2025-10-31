
'use client';
import RoomAvailability from "@/components/room-availability";
import { useRooms, useAllBookings } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { bookings, isLoading: bookingsLoading } = useAllBookings();

  if (roomsLoading || bookingsLoading || !rooms || !bookings) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <RoomAvailability rooms={rooms} initialBookings={bookings} />
    </div>
  );
}
