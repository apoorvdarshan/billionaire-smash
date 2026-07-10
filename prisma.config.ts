import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  experimental: {
    adapter: true,
  },

  async adapter() {
    if (process.env.TURSO_DATABASE_URL) {
      return new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    }
    return null;
  },
});
