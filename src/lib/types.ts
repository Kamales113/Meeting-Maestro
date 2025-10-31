
import type { Timestamp } from 'firebase/firestore';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: ('Projector' | 'Whiteboard' | 'Conference Phone' | 'TV')[];
  imageUrl: string;
  imageHint: string;
};

export type Booking = {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  roomId: string;
  startTime: Date | Timestamp;
  endTime: Date | Timestamp;
  title: string;
};
