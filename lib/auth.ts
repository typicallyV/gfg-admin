export interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function verifyAdminToken(token: string): Promise<{ valid: boolean; payload?: JwtUserPayload }> {
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode base64url signature to binary
    const base64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!isValid) return { valid: false };

    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload: JwtUserPayload = JSON.parse(payloadJson);

    // Check expiration if present
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
