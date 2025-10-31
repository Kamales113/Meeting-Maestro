
"use client";

import { useState } from "react";
import { Booking, Room } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useBookingsByRoom } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { BookingForm } from "./booking-form";
import { Card } from "./ui/card";
import { useFirestore, deleteDocumentNonBlocking, updateDocumentNonBlocking, WithId } from "@/firebase";
import { doc } from "firebase/firestore";

export default function MyBookingsClient({ initialBookings, rooms }: { initialBookings: WithId<Booking>[], rooms: WithId<Room>[] }) {
  const [editingBooking, setEditingBooking] = useState<WithId<Booking> | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<WithId<Booking> | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const { bookings: roomBookingsForEdit } = useBookingsByRoom(editingBooking?.roomId || '');

  const handleCancel = () => {
    if (!bookingToCancel) return;
    
    const bookingRef = doc(firestore, 'bookings', bookingToCancel.id);
    deleteDocumentNonBlocking(bookingRef);

    toast({ title: "Booking Cancelled", description: `Your meeting "${bookingToCancel.title}" has been cancelled.` });
    setBookingToCancel(null);
  };

  const handleEditSubmit = (values: { startTime: Date, endTime: Date, title: string }) => {
    if (!editingBooking) return;

    const bookingRef = doc(firestore, 'bookings', editingBooking.id);
    updateDocumentNonBlocking(bookingRef, values);

    toast({ title: "Booking Updated", description: "Your meeting details have been updated." });
    setEditingBooking(null);
  }

  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name || 'Unknown Room';

  return (
    <>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meeting</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBookings.length > 0 ? (
              initialBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.title}</TableCell>
                  <TableCell>{getRoomName(booking.roomId)}</TableCell>
                  <TableCell>{format(booking.startTime as Date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{`${format(booking.startTime as Date, "h:mm a")} - ${format(booking.endTime as Date, "h:mm a")}`}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingBooking(booking)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBookingToCancel(booking)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  You have no bookings.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      
      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your meeting
              "{bookingToCancel?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent>
             <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogDescription>
                    Update the details for your meeting.
                </DialogDescription>
             </DialogHeader>
             {editingBooking && (
                <BookingForm
                    room={rooms.find(r => r.id === editingBooking.roomId)!}
                    bookings={(roomBookingsForEdit || []).filter(b => b.id !== editingBooking.id)}
                    onSubmit={handleEditSubmit}
                    initialData={{
                        title: editingBooking.title,
                        startTime: editingBooking.startTime as Date,
                        endTime: editingBooking.endTime as Date,
                    }}
                />
             )}
        </DialogContent>
      </Dialog>
    </>
  );
}
