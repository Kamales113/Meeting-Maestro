
'use client';
import { useMyBookings, useRooms } from "@/lib/data";
import MyBookingsClient from "@/components/my-bookings-client";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyBookingsPage() {
  const { user, isUserLoading: userLoading } = useUser();
  const { bookings, isLoading: bookingsLoading } = useMyBookings(user?.uid);
  const { rooms, isLoading: roomsLoading } = useRooms();

  if (userLoading || bookingsLoading || roomsLoading || !bookings || !rooms) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming and past reservations.</p>
      </div>
      <MyBookingsClient initialBookings={bookings} rooms={rooms} />
    </div>
  );
}
