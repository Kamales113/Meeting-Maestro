
import { Room, Booking } from './types';
import { collection, doc, query, where } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import type { WithId } from '@/firebase';

// This file now primarily exports hooks for accessing Firestore data.

/**
 * Hook to get all rooms from Firestore.
 */
export const useRooms = () => {
  const firestore = useFirestore();
  const roomsQuery = useMemoFirebase(() => collection(firestore, 'rooms'), [firestore]);
  const { data: rooms, isLoading, error } = useCollection<Omit<Room, 'id'>>(roomsQuery);
  return { rooms, isLoading, error };
};

/**
 * Hook to get all bookings from Firestore.
 */
export const useAllBookings = () => {
    const firestore = useFirestore();
    const { user } = useUser(); // Get user to ensure authentication
    // This query is expensive and not ideal for production.
    // It would be better to query bookings for a specific room or user.
    // For this app's purpose, we query all bookings and then filter on the client.
    const bookingsQuery = useMemoFirebase(() => 
        user ? collection(firestore, 'bookings') : null, 
    [firestore, user]);
    const { data: bookings, isLoading, error } = useCollection<Omit<Booking, 'id' | 'startTime' | 'endTime'> & { startTime: { seconds: number }, endTime: { seconds: number } }>(bookingsQuery);

    // Convert Firestore timestamps to JS Date objects
    const mappedBookings = bookings?.map(b => ({
        ...b,
        startTime: new Date(b.startTime.seconds * 1000),
        endTime: new Date(b.endTime.seconds * 1000),
    }));

    return { bookings: mappedBookings, isLoading, error };
}


/**
 * Hook to get bookings for a specific user.
 * @param userId The ID of the user.
 */
export const useMyBookings = (userId: string | undefined) => {
  const firestore = useFirestore();
  const bookingsQuery = useMemoFirebase(() => 
    userId ? query(collection(firestore, 'bookings'), where('userId', '==', userId)) : null,
    [firestore, userId]
  );
  const { data: bookings, isLoading, error } = useCollection<Omit<Booking, 'id' | 'startTime' | 'endTime'> & { startTime: { seconds: number }, endTime: { seconds: number } }>(bookingsQuery);
  
  const mappedBookings = bookings?.map(b => ({
    ...b,
    startTime: new Date(b.startTime.seconds * 1000),
    endTime: new Date(b.endTime.seconds * 1000),
  })).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  return { bookings: mappedBookings, isLoading, error };
};

/**
 * Hook to get bookings for a specific room.
 * @param roomId The ID of the room.
 */
export const useBookingsByRoom = (roomId: string) => {
    const firestore = useFirestore();
    const { user } = useUser(); // Get user to ensure authentication
    const bookingsQuery = useMemoFirebase(
      () => user ? query(collection(firestore, 'bookings'), where('roomId', '==', roomId)) : null,
      [firestore, roomId, user]
    );
    const { data: bookings, isLoading, error } = useCollection<Omit<Booking, 'id' | 'startTime' | 'endTime'> & { startTime: { seconds: number }, endTime: { seconds: number } }>(bookingsQuery);

    const mappedBookings = bookings?.map(b => ({
        ...b,
        startTime: new Date(b.startTime.seconds * 1000),
        endTime: new Date(b.endTime.seconds * 1000),
    }));

    return { bookings: mappedBookings, isLoading, error };
}

// The following functions can be kept for utility, but data comes from hooks now.
import { isWithinInterval } from 'date-fns';

export const isRoomAvailable = (roomId: string, time: Date, allBookings: WithId<Booking>[]): boolean => {
  if (!allBookings) return true;
  const roomBookings = allBookings.filter(b => b.roomId === roomId);
  return !roomBookings.some(b => isWithinInterval(time, { start: b.startTime, end: b.endTime }));
};
