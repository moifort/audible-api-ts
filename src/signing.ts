import { createSign } from 'node:crypto'
import type { AudibleCredentials } from './types.js'

/** Sign an Audible API request using RSA SHA256 with the device private key */
export const signRequest = (
  method: string,
  path: string,
  body: string,
  credentials: AudibleCredentials,
) => {
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  const data = `${method}\n${path}\n${date}\n${body}\n${credentials.adpToken}`

  const signer = createSign('SHA256')
  signer.update(data)
  const signature = signer.sign(credentials.devicePrivateKey, 'base64')

  return {
    'x-adp-token': credentials.adpToken,
    'x-adp-alg': 'SHA256withRSA:1.0',
    'x-adp-signature': `${signature}:${date}`,
  }
}
