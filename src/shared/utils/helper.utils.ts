import { urlAlphabet, customAlphabet } from 'nanoid';

export const randomURLSafeCharacters = (length: number = 10): string => {
  return customAlphabet(urlAlphabet, length)();
};

export const getUniqueValuesAndCount = <T extends Record<K, any>[], K extends keyof T[number]>(items: T, key: K): { [x in T[number][K]]: number } => {
  const groupCounts = {} as { [x in T[number][K]]: number };
  items.forEach((item) => {
    const value = item[key];
    if (groupCounts[value]) {
      groupCounts[value]++;
    } else {
      groupCounts[value] = 1;
    }
  });
  return groupCounts;
};

export const sortByProperty = <T extends Record<string, any>>(arr: T[], prop: keyof T, order: 'ASC' | 'DESC' = 'DESC'): T[] => {
  return arr.sort((a, b) => (order === 'DESC' ? b[prop] - a[prop] : a[prop] - b[prop]));
};
