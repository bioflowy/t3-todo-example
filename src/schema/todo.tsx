import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(3, { message: "Must be 3 or more characters long" }),
  description: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" }),
});
