import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTimeRange(start: Date, end: Date): string {
  const date = format(start, "MMMM d, yyyy");
  const startTime = format(start, "h:mm a");
  const endTime = format(end, "h:mm a");
  return `${date} from ${startTime} to ${endTime}`;
}
