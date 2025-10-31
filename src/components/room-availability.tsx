
"use client";

import { useState } from "react";
import Image from "next/image";
import { Room, Booking } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Projector,
  Tv,
  Phone,
  Video,
  Presentation,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { isRoomAvailable, useBookingsByRoom } from "@/lib/data";
import { BookingForm } from "./booking-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDateTimeRange, cn } from "@/lib/utils";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import type { WithId } from "@/firebase";
import { handleBookingConfirmation } from "@/app/actions";
import { format } from "date-fns";

const equipmentIcons: { [key: string]: React.ElementType } = {
  Projector: Presentation,
  Whiteboard: Projector,
  "Conference Phone": Phone,
  TV: Tv,
};

function RoomCard({ room, isAvailable, onBook }: { room: Room; isAvailable: boolean; onBook: (room: Room) => void }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={room.imageHint}
          />
        </div>
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-xl">{room.name}</CardTitle>
            <Badge variant={isAvailable ? "default" : "secondary"} className={cn(isAvailable ? "bg-primary/20 text-primary-foreground border-primary/30" : "bg-muted")}>
              {isAvailable ? <CheckCircle2 className="mr-1 h-3 w-3 text-primary" /> : <XCircle className="mr-1 h-3 w-3" />}
              {isAvailable ? "Available" : "Occupied"}
            </Badge>
          </div>
          <CardDescription className="flex items-center pt-2">
            <Users className="mr-2 h-4 w-4" />
            Capacity: {room.capacity}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Equipment</h4>
          {room.equipment.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {room.equipment.map((item) => {
                const Icon = equipmentIcons[item] || Video;
                return (
                  <div key={item} className="flex items-center text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
                    <Icon className="mr-1.5 h-4 w-4" />
                    {item}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No special equipment.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button onClick={() => onBook(room)} className="w-full" disabled={!isAvailable}>
          <CalendarIcon className="mr-2 h-4 w-4" /> Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function RoomAvailability({ rooms, initialBookings }: { rooms: WithId<Room>[]; initialBookings: WithId<Booking>[] }) {
  const [selectedRoom, setSelectedRoom] = useState<WithId<Room> | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const { bookings: roomBookings } = useBookingsByRoom(selectedRoom?.id || '');

  const handleBook = (room: WithId<Room>) => {
    setSelectedRoom(room);
    setIsBookingDialogOpen(true);
  };

  const handleBookingSubmit = (values: { startTime: Date; endTime: Date; title: string }) => {
    if (!selectedRoom || !user || !user.email) return;
    
    const newBooking = { 
        ...values, 
        roomId: selectedRoom.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userImage: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
    };

    const bookingsCol = collection(firestore, 'bookings');
    addDocumentNonBlocking(bookingsCol, newBooking);

    setIsBookingDialogOpen(false);
    toast({
      title: "Booking Confirmed!",
      description: `A confirmation email has been logged to the console.`,
    });

    // Trigger email confirmation
    handleBookingConfirmation(user.email, {
      roomName: selectedRoom.name,
      startTime: format(values.startTime, "h:mm a"),
      endTime: format(values.endTime, "h:mm a"),
      bookingDate: format(values.startTime, "MMMM d, yyyy"),
      meetingTitle: values.title,
      userName: user.displayName || 'Anonymous',
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Room Availability</h1>
        <p className="text-muted-foreground">Book a room for your next meeting.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isAvailable={isRoomAvailable(room.id, new Date(), initialBookings)}
            onBook={handleBook}
          />
        ))}
      </div>
      
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book {selectedRoom?.name}</DialogTitle>
            <DialogDescription>
              Select a date and time for your meeting.
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <BookingForm
              room={selectedRoom}
              bookings={roomBookings || []}
              onSubmit={handleBookingSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
