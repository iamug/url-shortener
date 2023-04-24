import { urlAlphabet, customAlphabet } from 'nanoid';

export const randomURLSafeCharacters = (length: number = 10): string => {
  return customAlphabet(urlAlphabet, length)();
};
