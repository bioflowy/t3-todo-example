import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "../../../schema/todo";
import { type TodoEntry } from "../../../types/todo";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const todoRouter = router({
  create: protectedProcedure
    .input(createTodoSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input?.title,
          description: input?.description,
          ownerId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ input, ctx }) => {
      const deleteCount = await ctx.prisma.todo.deleteMany({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
      return deleteCount.count;
    }),
  update: protectedProcedure
    .input(updateTodoSchema)
    .mutation(async ({ input, ctx }) => {
      const prev = await ctx.prisma.todo.findUniqueOrThrow({
        where: { id: input.id },
      });
      if (prev.ownerId !== ctx.session.user.id) {
        throw new Error("Update Error");
      }
      const newTodo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return newTodo;
    }),
  getAll: publicProcedure.query(async ({ ctx }): Promise<TodoEntry[]> => {
    return ctx.prisma.todo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        owner: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }),
});
