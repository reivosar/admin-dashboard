import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  console.log(`Start seeding ...`);

  const first_name = "first";
  const last_name = "last";
  const birth_date = new Date("2000/01/01");
  const gender = "other";
  const operator = "seed";
  const authorizationData = {
    auth_id: "sample@admindashboard.com",
    password_hash:
      "$2b$10$mPihCO1HYilKwoc9bzqRWOV9h.1iyc8FICHuAKkTdfGUocshE3YLm",
    created_by: operator,
  };
  const contactData = {
    email: "sample@admindashboard.com",
    created_by: operator,
  };

  const user = await prisma.user.create({
    data: {
      user_profiles: {
        create: {
          first_name: first_name,
          last_name: last_name,
          birth_date: birth_date,
          gender: gender,
          created_by: operator,
        },
      },
      user_authorizations: {
        create: { ...authorizationData },
      },
      user_contacts: {
        create: { ...contactData },
      },
      user_actives: {
        create: {},
      },
    },
  });

  console.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
