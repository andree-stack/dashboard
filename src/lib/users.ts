import bcrypt from "bcryptjs";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

// Demo user store. Password defaults to "philips2026" unless overridden via
// env — swap this module for a real database lookup in production.
const DEMO_PASSWORD_HASH = bcrypt.hashSync(
  process.env.DEMO_USER_PASSWORD ?? "philips2026",
  10
);

export const users: AppUser[] = [
  {
    id: "1",
    email: process.env.DEMO_USER_EMAIL ?? "admin@tamsaglobal.com",
    name: "Tamsa Admin",
    passwordHash: DEMO_PASSWORD_HASH,
  },
];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
