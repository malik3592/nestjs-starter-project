import * as crypto from 'crypto';

// Constants for encryption
const algorithm = 'aes-256-cbc';
const secretKey = 'asdfghjklqwertyuiomnbvcxdfghjklo'; // Must be 32 characters
const iv = 'asxcfvgbhnjmkloi'; // Must be 16 characters

/**
 * Encrypts the given data using AES-256-CBC encryption.
 * @param data The data to be encrypted.
 * @returns Encrypted string in base64 format.
 */
export function encrypt(data: any): string {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/**
 * Decrypts the given encrypted text using AES-256-CBC decryption.
 * @param text The encrypted string in base64 format.
 * @returns The decrypted data as an object.
 */
export function decrypt(text: string): any {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
