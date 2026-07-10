import { createClient, type Client } from "@libsql/client/web";

let client: Client | undefined;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return client;
}

export function numberValue(value: unknown): number {
  return typeof value === "bigint" ? Number(value) : Number(value ?? 0);
}
