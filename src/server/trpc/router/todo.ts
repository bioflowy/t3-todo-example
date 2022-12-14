import { z } from "zod";
import { createTodoSchema } from "../../../schema/todo";

import { router, publicProcedure } from "../trpc";

export const todoRouter = router({
  create: publicProcedure.input(createTodoSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.todo.create({
      data: input,
    });
  }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.delete({
        where: { id: input.id },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
