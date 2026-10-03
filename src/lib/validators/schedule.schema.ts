import { z } from "zod";

// Mirrors load-shedding-api/src/modules/schedule/schedule.schema.ts.
// The overlap check itself only happens server-side (it needs the DB) —
// this just catches obviously-invalid input before that round trip.
export const createScheduleSchema = z
  .object({
    areaId: z.string().uuid("Please select an area"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    reason: z.string().trim().min(3, "Reason must be at least 3 characters").max(500),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
