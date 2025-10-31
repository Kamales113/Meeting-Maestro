
'use client';
import { useEffect } from 'react';
import { useFirestore, useCollection, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Room } from '@/lib/types';

const initialRooms: Omit<Room, 'id'>[] = [
  { name: 'The Innovator', capacity: 4, equipment: ['Whiteboard', 'TV'], imageUrl: PlaceHolderImages[0].imageUrl, imageHint: PlaceHolderImages[0].imageHint },
  { name: 'The Huddle', capacity: 2, equipment: ['TV'], imageUrl: PlaceHolderImages[1].imageUrl, imageHint: PlaceHolderImages[1].imageHint },
  { name: 'The Boardroom', capacity: 12, equipment: ['Projector', 'Conference Phone', 'Whiteboard'], imageUrl: PlaceHolderImages[2].imageUrl, imageHint: PlaceHolderImages[2].imageHint },
  { name: 'The Nook', capacity: 2, equipment: [], imageUrl: PlaceHolderImages[3].imageUrl, imageHint: PlaceHolderImages[3].imageHint },
  { name: 'The Collab', capacity: 6, equipment: ['Whiteboard', 'TV'], imageUrl: PlaceHolderImages[4].imageUrl, imageHint: PlaceHolderImages[4].imageHint },
  { name: 'War Room', capacity: 8, equipment: ['Projector', 'Whiteboard'], imageUrl: PlaceHolderImages[5].imageUrl, imageHint: PlaceHolderImages[5].imageHint },
];


export function useSeedData() {
  const firestore = useFirestore();
  const roomsCollection = useMemoFirebase(() => collection(firestore, 'rooms'), [firestore]);
  const { data: rooms, isLoading } = useCollection(roomsCollection);

  useEffect(() => {
    if (!isLoading && rooms && rooms.length === 0) {
      console.log('No rooms found in Firestore, seeding initial data...');
      initialRooms.forEach(async (roomData) => {
        // Use a consistent ID based on the name to avoid duplicates on re-renders
        const roomId = roomData.name.toLowerCase().replace(/\s+/g, '-');
        const roomRef = doc(firestore, 'rooms', roomId);
        setDocumentNonBlocking(roomRef, roomData, { merge: true });
      });
    }
  }, [rooms, isLoading, firestore]);
}
