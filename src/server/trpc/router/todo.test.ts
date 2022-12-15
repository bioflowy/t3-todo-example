import { test, expect, describe } from "vitest";

import { createContextInner } from "../context";
import type { AppRouter } from "./_app";
import { appRouter } from "./_app";
import type { inferProcedureInput } from "@trpc/server";

const createInput: inferProcedureInput<AppRouter["todo"]["create"]> = {
  title: "Add Unit test",
  description: "Add Create Unit Test",
};
const ctx = await createContextInner({
  session: {
    user: {
      id: "clbopauhz0000umekzyiiw4ww",
      name: "テストユーザ",
      email: "test@test.com",
    },
    expires: "1234567",
  },
});
const ctxAnotherUser = await createContextInner({
  session: {
    user: {
      id: "clbopauja0002umeko9x3bc63",
      name: "テストユーザ2",
      email: "test2@test.com",
    },
    expires: "1234567",
  },
});

describe("create", () => {
  test("create todo", async () => {
    const caller = appRouter.createCaller(ctx);

    const post = await caller.todo.create(createInput);
    expect(post?.id).toBeGreaterThan(0);
    expect(post?.ownerId).toBe(ctx.session?.user?.id);
    console.log(`test ${process.env.VITEST_WORKER_ID}`);
  });
});
describe("update", () => {
  test("update todo", async () => {
    const caller = appRouter.createCaller(ctx);
    const post = await caller.todo.create(createInput);

    const updateInput: inferProcedureInput<AppRouter["todo"]["update"]> = {
      id: post.id,
      title: "Update Unit test",
      description: "Add Update Unit Test",
    };
    const updated = await caller.todo.update(updateInput);
    expect(updated.title).toBe("Update Unit test");
    expect(updated.description).toBe("Add Update Unit Test");
    console.log(`test ${process.env.VITEST_WORKER_ID}`);
  });
  test("update another user's todo", async () => {
    const caller = appRouter.createCaller(ctx);
    const post = await caller.todo.create(createInput);

    const anotherCaller = appRouter.createCaller(ctxAnotherUser);
    const updateInput: inferProcedureInput<AppRouter["todo"]["update"]> = {
      id: post.id,
      title: "Update Unit test",
      description: "Add Update Unit Test",
    };
    expect(async () => {
      return anotherCaller.todo.update(updateInput);
    }).rejects.toThrow(new Error("Update Error"));
  });
});
describe("delete", () => {
  test("delete todo", async () => {
    const caller = appRouter.createCaller(ctx);
    const post = await caller.todo.create(createInput);

    const deleteInput: inferProcedureInput<AppRouter["todo"]["delete"]> = {
      id: post.id,
    };
    const deletedCount = await caller.todo.delete(deleteInput);
    expect(deletedCount).toBe(1);
  });
  test("delete another user's todo", async () => {
    const caller = appRouter.createCaller(ctx);
    const post = await caller.todo.create(createInput);

    const anotherCaller = appRouter.createCaller(ctxAnotherUser);
    const deleteInput: inferProcedureInput<AppRouter["todo"]["delete"]> = {
      id: post.id,
    };
    const deletedCount = await anotherCaller.todo.delete(deleteInput);
    expect(deletedCount).toBe(0);
  });
});
describe("getAll", () => {
  test("getAll", async () => {
    await ctx.prisma.todo.deleteMany({});
    const caller = appRouter.createCaller(ctx);
    await caller.todo.create(createInput);

    const posts = await caller.todo.getAll();
    expect(posts.length).toBe(1);
    expect(posts[0]?.owner.name).toBe("テストユーザ");
  });
});
