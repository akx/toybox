// Based on https://github.com/perry-mitchell/ulidx (MIT License, (c) 2021 Perry Mitchell)

type ULID = string;
type UUID = string;
const B32_CHARACTERS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_REGEX = /^[0-7][0-9a-hjkmnp-tv-zA-HJKMNP-TV-Z]{25}$/;
const UUID_REGEX = /^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;
const ENCODING = B32_CHARACTERS;
const ENCODING_LEN = ENCODING.length;
const TIME_MAX = 281_474_976_710_655; // from Math.pow(2, 48) - 1;
const TIME_LEN = 10;
const RANDOM_LEN = 16;

function crockfordEncode(input: Uint8Array): string {
  const output: number[] = [];
  let bitsRead = 0;
  let buffer = 0;
  const reversedInput = new Uint8Array([...input].reverse());
  for (const byte of reversedInput) {
    buffer |= byte << bitsRead;
    bitsRead += 8;

    while (bitsRead >= 5) {
      output.unshift(buffer & 0x1f);
      buffer >>>= 5;
      bitsRead -= 5;
    }
  }
  if (bitsRead > 0) {
    output.unshift(buffer & 0x1f);
  }
  return output.map((byte) => B32_CHARACTERS.charAt(byte)).join("");
}

function crockfordDecode(input: string): Uint8Array {
  const sanitizedInput = [...input.toUpperCase()].reverse().join("");
  const output: number[] = [];
  let bitsRead = 0;
  let buffer = 0;
  for (const character of sanitizedInput) {
    const byte = B32_CHARACTERS.indexOf(character);
    if (byte === -1) {
      throw new Error(`Invalid base 32 character found in string: ${character}`);
    }
    buffer |= byte << bitsRead;
    bitsRead += 5;
    while (bitsRead >= 8) {
      output.unshift(buffer & 0xff);
      buffer >>>= 8;
      bitsRead -= 8;
    }
  }
  if (bitsRead >= 5 || buffer > 0) {
    output.unshift(buffer & 0xff);
  }
  return new Uint8Array(output);
}

/**
 * Decode time from a ULID
 * @param id The ULID
 * @returns The decoded timestamp
 */
export function decodeTime(id: string): number {
  id = fixULIDBase32(id);
  if (id.length !== TIME_LEN + RANDOM_LEN) {
    throw new Error("Malformed ULID");
  }
  const time = [...id.slice(0, Math.max(0, TIME_LEN)).toUpperCase()]
    .reverse()
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((carry, char, index) => {
      const encodingIndex = ENCODING.indexOf(char);
      if (encodingIndex === -1) {
        throw new Error(`Time decode error: Invalid character: ${char}`);
      }
      return carry + encodingIndex * Math.pow(ENCODING_LEN, index);
    }, 0);
  if (time > TIME_MAX) {
    throw new Error(`Malformed ULID: timestamp too large: ${time}`);
  }
  return time;
}

function encodeRandom(len: number): string {
  const buffer = new Uint8Array(len);
  globalThis.crypto.getRandomValues(buffer);
  let str = "";
  for (const element of buffer) {
    str += B32_CHARACTERS[element % B32_CHARACTERS.length];
  }
  return str;
}

/**
 * Encode the time portion of a ULID
 * @param now The current timestamp
 * @param len Length to generate
 * @returns The encoded time
 */
function encodeTime(now: number, len: number): string {
  if (Number.isNaN(now)) {
    throw new TypeError(`Time must be a number: ${now}`);
  }
  if (now > TIME_MAX) {
    throw new Error(`Cannot encode a time larger than ${TIME_MAX}: ${now}`);
  }
  if (now < 0) {
    throw new Error(`Time must be positive: ${now}`);
  }
  if (!Number.isInteger(now)) {
    throw new TypeError(`Time must be an integer: ${now}`);
  }
  let mod: number,
    str: string = "";
  for (let currentLen = len; currentLen > 0; currentLen--) {
    mod = now % ENCODING_LEN;
    str = ENCODING.charAt(mod) + str;
    now = (now - mod) / ENCODING_LEN;
  }
  return str;
}

/**
 * Fix a ULID's Base32 encoding -
 * i and l (case-insensitive) will be treated as 1 and o (case-insensitive) will be treated as 0.
 * hyphens are ignored during decoding.
 * @param id The ULID
 * @returns The cleaned up ULID
 */
export function fixULIDBase32(id: string): string {
  return id.replaceAll(/i/gi, "1").replaceAll(/l/gi, "1").replaceAll(/o/gi, "0").replaceAll("-", "");
}

/**
 * Check if a ULID is valid
 * @param id The ULID to test
 * @returns True if valid, false otherwise
 * @example
 *   isValid("01HNZX8JGFACFA36RBXDHEQN6E"); // true
 *   isValid(""); // false
 */
export function isValid(id: string): boolean {
  return id.length === TIME_LEN + RANDOM_LEN && [...id.toUpperCase()].every((char) => ENCODING.includes(char));
}

/**
 * Generate a ULID
 * @param seedTime Optional time seed
 * @returns A ULID string
 */
export function generate(seedTime?: number): ULID {
  const seed = seedTime !== undefined && !Number.isNaN(seedTime) ? seedTime : Date.now();
  return encodeTime(seed, TIME_LEN) + encodeRandom(RANDOM_LEN);
}

/**
 * Convert a ULID to a UUID
 * @param ulid The ULID to convert
 * @returns A UUID string
 */
export function ulidToUUID(ulid: string): UUID {
  const isValid = ULID_REGEX.test(fixULIDBase32(ulid));
  if (!isValid) {
    throw new Error("Invalid ULID");
  }
  const uint8Array = crockfordDecode(ulid);
  let uuid = [...uint8Array].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  uuid = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
  return uuid;
}

/**
 * Convert a UUID to a ULID
 * @param uuid The UUID to convert
 * @returns A ULID string
 */
export function uuidToULID(uuid: string): ULID {
  const isValid = UUID_REGEX.test(uuid);
  if (!isValid) {
    throw new Error("Invalid UUID");
  }
  const uint8Array = new Uint8Array(
    uuid
      .replaceAll("-", "")
      .match(/.{1,2}/g)!
      .map((byte) => Number.parseInt(byte, 16)),
  );
  return crockfordEncode(uint8Array);
}

export function smellsLikeULID(input: string): boolean {
  return ULID_REGEX.test(fixULIDBase32(input));
}
export function smellsLikeUUID(input: string): boolean {
  return UUID_REGEX.test(input);
}
