import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 16);

export function generatePublicId(): string {
  return nanoid();
}
