import { nanoid } from 'nanoid';

export const generateShareableLink = () => {
  return nanoid(10); // Generates a random 10-character string
};