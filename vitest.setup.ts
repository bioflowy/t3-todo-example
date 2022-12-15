import process from "process";
import fs from "fs";
import { beforeAll, afterAll } from "vitest";

// DATABASE_URL には 'mysql://user:password@localhost:3306/db' のような文字列が入っている想定。
process.env.DATABASE_URL = `file:./db.sqlite-test-${process.env.VITEST_WORKER_ID}`;

beforeAll(async () => {
  await fs.copyFileSync(
    "prisma/reset.sqlite",
    `prisma/db.sqlite-test-${process.env.VITEST_WORKER_ID}`
  );
});
afterAll(async () => {
  fs.unlinkSync(`prisma/db.sqlite-test-${process.env.VITEST_WORKER_ID}`);
});
