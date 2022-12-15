import { test, expect } from "vitest";

import { createContextInner } from "../context";
import type { AppRouter } from "./_app";
import { appRouter } from "./_app";
import type { inferProcedureInput } from "@trpc/server";

test("create and getAll todos", async () => {
  const ctx = await createContextInner({
    session: {
      user: {
        id: "id12345",
        name: "testUser",
        email: "test@test.com",
      },
      expires: "1234567",
    },
  });
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["todo"]["create"]> = {
    title: "Add Unit test",
    description: "Add Unit test by vitest",
  };

  const post = await caller.todo.create(input);
  const posts = await caller.todo.getAll();
  expect(posts.length).toBe(1);
  expect(post.id).toBeGreaterThan(0);
});
