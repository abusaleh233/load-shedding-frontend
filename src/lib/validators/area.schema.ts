import { z } from "zod";

// Mirrors load-shedding-api/src/modules/area/area.schema.ts
export const createAreaSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  feederCode: z.string().trim().min(2, "Feeder code must be at least 2 characters").max(30),
  substationId: z.string().uuid("Please select a substation"),
});
export type CreateAreaInput = z.infer<typeof createAreaSchema>;

export const updateAreaSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  substationId: z.string().uuid().optional(),
});
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
