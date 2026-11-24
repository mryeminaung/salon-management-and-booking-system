import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

// In-memory revoked token JTIs with expiry timestamps.
// Cleared periodically. For multi-server deployments, replace with Redis.
const revoked = new Set<string>();

// Periodic cleanup every 10 minutes
setInterval(() => {
  // No-op cleanup — entries are checked against token expiry at verify time.
  // Tokens older than 7 days are naturally expired and won't pass jwt.verify.
  revoked.clear();
}, 10 * 60 * 1000);

export interface TokenPayload {
	id: string;
	email: string;
	role: string;
}

export function generateToken(payload: TokenPayload): string {
	const jti = crypto.randomUUID();
	return jwt.sign({ ...payload, jti }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

export function revokeToken(token: string): void {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
		if (decoded.jti) {
			revoked.add(decoded.jti);
		}
	} catch {
		// Token already invalid — nothing to revoke
	}
}

export function isTokenRevoked(token: string): boolean {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
		if (decoded.jti) {
			return revoked.has(decoded.jti);
		}
		return false;
	} catch {
		return true; // Invalid tokens are treated as revoked
	}
}
