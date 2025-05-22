import crypto from "crypto";
import config from "../config";

export function getSecure10Digit() {
	const array = new Uint32Array(1);
	crypto.getRandomValues(array);
	return (array[0] % 1000000000).toString();
}

export function encrypt(value: string): string {
	// Validate input
	if (typeof value !== "string" || value.length === 0) {
		throw new Error("Encryption failed: Input must be a non-empty string");
	}
	try {
		// Generate IV (12 bytes for AES-GCM)
		const iv = crypto.randomBytes(12);
		// Initialize cipher
		const cipher = crypto.createCipheriv("aes-256-gcm", config.SECRET_KEY, iv);
		// Encrypt the data
		let encrypted = cipher.update(value, "utf8", "hex");
		encrypted += cipher.final("hex");
		// Get authentication tag (for integrity check)
		const authTag = cipher.getAuthTag().toString("hex");
		// Return IV:AuthTag:Ciphertext
		return `${iv.toString("hex")}:${authTag}:${encrypted}`;
	} catch (err) {
		// Convert all encryption errors to a generic error
		throw new Error("Encryption failed: Could not secure the data");
	}
}

export function decrypt(value: string): string {
	// Validate input format
	if (typeof value !== "string") {
		throw new Error("Decryption failed: Invalid input format");
	}
	const parts = value.split(":");
	if (parts.length !== 3) {
		throw new Error("Decryption failed: Malformed encrypted data");
	}

	try {
		const [ivHex, authTagHex, encryptedText] = parts;
		// Validate IV and auth tag length
		if (!ivHex || !authTagHex || !encryptedText) {
			throw new Error("Decryption failed: Missing components");
		}
		const iv = Buffer.from(ivHex, "hex");
		const authTag = Buffer.from(authTagHex, "hex");
		// Validate buffer lengths
		if (iv.length !== 12) {
			// GCM uses 12-byte IV
			throw new Error("Decryption failed: Invalid IV length");
		}
		const decipher = crypto.createDecipheriv("aes-256-gcm", config.SECRET_KEY, iv);
		decipher.setAuthTag(authTag);
		let decrypted = decipher.update(encryptedText, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	} catch (err) {
		// Convert all decryption errors to a generic error to avoid leaking sensitive info
		throw new Error("Decryption failed: Invalid or tampered data");
	}
}
