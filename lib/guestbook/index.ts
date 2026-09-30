import { getDb } from "../neon.ts";
import { createGuestbook, type Guestbook } from "./guestbook.ts";

let instance: Guestbook | undefined;

// The app's guestbook module, backed by Neon.
export function getGuestbook(): Guestbook {
  instance ??= createGuestbook(getDb());
  return instance;
}

export type { ChangeError, CreateError, Entry } from "./guestbook.ts";
