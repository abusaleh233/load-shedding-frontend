import { z } from "zod";

// Mirrors load-shedding-api/src/modules/substation/substation.schema.ts
export const substationStatusEnum = z.enum(["ACTIVE", "MAINTENANCE", "DECOMMISSIONED"]);

export const createSubstationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  code: z.string().trim().min(2, "Code must be at least 2 characters").max(30),
  location: z.string().trim().min(2, "Location must be at least 2 characters").max(255),
  capacityMW: z.coerce.number().positive("Capacity must be a positive number"),
  status: substationStatusEnum.optional(),
});
export type CreateSubstationInput = z.infer<typeof createSubstationSchema>;

export const updateSubstationSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  location: z.string().trim().min(2).max(255).optional(),
  capacityMW: z.coerce.number().positive().optional(),
  status: substationStatusEnum.optional(),
});
export type UpdateSubstationInput = z.infer<typeof updateSubstationSchema>;
