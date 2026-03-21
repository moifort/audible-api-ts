import { Buffer } from 'node:buffer'

export const base64url = (buffer: Buffer) =>
  buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const base64nopad = (buffer: Buffer) => buffer.toString('base64').replace(/=+$/, '')

export const toHexString = (input: string) => Buffer.from(input, 'utf-8').toString('hex')
