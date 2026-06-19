import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "users.json");

async function readAll(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeAll(users: StoredUser[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function getUserByEmail(email: string) {
  const users = await readAll();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(name: string, email: string, password: string) {
  const existing = await getUserByEmail(email);
  if (existing) throw new Error("An account with this email already exists.");
  const users = await readAll();
  const user: StoredUser = {
    id: `u_${Date.now().toString(36)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeAll(users);
  return user;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}
