import { z } from "zod";

export const customTopicSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(3, "Tulis minimal 3 karakter.")
    .max(80, "Maksimal 80 karakter."),
});

export type CustomTopicInput = z.infer<typeof customTopicSchema>;
