
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { addMinutes, format, set, startOfDay, isBefore, isAfter } from "date-fns";
import { useState } from "react";
import { Booking, Room } from "@/lib/types";
import { WithId } from "@/firebase";

const generateTimeSlots = (date: Date, bookings: WithId<Booking>[]) => {
  const dayStart = set(date, { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });
  const dayEnd = set(date, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
  const slots: Date[] = [];
  let current = dayStart;

  while (current <= dayEnd) {
    slots.push(current);
    current = addMinutes(current, 30);
  }
  
  return slots.filter(slot => 
    !bookings.some(b => slot >= (b.startTime as Date) && slot < (b.endTime as Date))
  );
};

export function BookingForm({
  room,
  bookings,
  onSubmit,
  initialData,
}: {
  room: Room;
  bookings: WithId<Booking>[];
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialData?.startTime || new Date());
  
  const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    startTime: z.date(),
    endTime: z.date(),
  }).refine(data => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
    },
  });

  const availableTimeSlots = generateTimeSlots(selectedDate, bookings);
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDate = startOfDay(date);
      setSelectedDate(newDate);
      form.reset({ ...form.getValues(), startTime: undefined, endTime: undefined });
    }
  };
  
  const handleStartTimeChange = (timeString: string) => {
    const time = new Date(timeString);
    form.setValue('startTime', time);
    if (form.getValues('endTime') && isBefore(form.getValues('endTime'), time)) {
        form.setValue('endTime', undefined as any);
    }
  };

  const selectedStartTime = form.watch("startTime");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Project Phoenix Sync" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select onValueChange={handleStartTimeChange} value={field.value?.toISOString()}>
                  <FormControl>
                    <SelectTrigger>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.toISOString()} value={slot.toISOString()}>
                        {format(slot, "h:mm a")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <Select onValueChange={(val) => field.onChange(new Date(val))} value={field.value?.toISOString()}>
                  <FormControl>
                    <SelectTrigger disabled={!selectedStartTime}>
                       <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimeSlots
                      .filter(slot => selectedStartTime && isAfter(slot, selectedStartTime))
                      .map((slot) => (
                        <SelectItem key={slot.toISOString()} value={addMinutes(slot, 30).toISOString()}>
                          {format(addMinutes(slot, 30), "h:mm a")}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Confirm Booking</Button>
      </form>
    </Form>
  );
}
