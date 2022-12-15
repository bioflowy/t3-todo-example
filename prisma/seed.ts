import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  prisma.$connect();
  const saltRounds = 10;
  const password = "test";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      id: "clbopauhz0000umekzyiiw4ww",
      email: "test@test.com",
      name: "テストユーザ",
      crypted_password: hashedPassword,
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: "test2@test.com" },
    update: {},
    create: {
      id: "clbopauja0002umeko9x3bc63",
      email: "test2@test.com",
      name: "テストユーザ2",
      crypted_password: hashedPassword,
    },
  });
  console.log({ testUser, testUser2 });
}
main()
  .then(() => {
    console.log("finished");
  })
  .finally(() => {
    prisma.$disconnect();
  });
