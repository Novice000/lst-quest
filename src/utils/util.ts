import crypto from "crypto";
import config from "../config";
import AppError from "./errors";

export function getSecure10Digit() {
	const array = new Uint32Array(1);
	crypto.getRandomValues(array);
	const accountNumber = (array[0] % 1000000000).toString();
	if (accountNumber.length === 9) {
		return "0" + accountNumber;
	}
	return accountNumber;
}


export function encrypt(value: string): string {
	// Validate input
	if (typeof value !== "string" || value.length === 0) {
		throw new AppError(500, "Encryption failed: Input must be a non-empty string");
	}
	try {
		// Generate IV (12 bytes for AES-GCM)
		const iv = crypto.randomBytes(12);
		// Initialize cipher
		const cipher = crypto.createCipheriv(
			"aes-256-gcm",
			Buffer.from(config.SECRET_KEY, "hex"),
			iv
		);
		// Encrypt the data
		let encrypted = cipher.update(value, "utf8", "hex");
		encrypted += cipher.final("hex");
		// Get authentication tag (for integrity check)
		const authTag = cipher.getAuthTag().toString("hex");
		// Return IV:AuthTag:Ciphertext
		return `${iv.toString("hex")}:${authTag}:${encrypted}`;
	} catch (err) {
		// Convert all encryption errors to a generic error
		throw new AppError(500, "Encryption failed: Could not secure the data");
	}
}

export function decrypt(value: string): string {
	// Validate input format
	if (typeof value !== "string") {
		throw new AppError(500, "Decryption failed: Invalid input format");
	}
	const parts = value.split(":");
	if (parts.length !== 3) {
		throw new AppError(500, "Decryption failed: Malformed encrypted data");
	}

	try {
		const [ivHex, authTagHex, encryptedText] = parts;
		// Validate IV and auth tag length
		if (!ivHex || !authTagHex || !encryptedText) {
			throw new AppError(500, "Decryption failed: Missing components");
		}
		const iv = Buffer.from(ivHex, "hex");
		const authTag = Buffer.from(authTagHex, "hex");
		// Validate buffer lengths
		if (iv.length !== 12) {
			// GCM uses 12-byte IV
			throw new AppError(500, "Decryption failed: Invalid IV length");
		}
		const decipher = crypto.createDecipheriv(
			"aes-256-gcm",
			Buffer.from(config.SECRET_KEY, "hex"),
			iv
		);
		decipher.setAuthTag(authTag);
		let decrypted = decipher.update(encryptedText, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	} catch (err) {
		// Convert all decryption errors to a generic error to avoid leaking sensitive info
		throw new AppError(500, "Decryption failed: Invalid or tampered data");
	}
}

export function generateFutureExpiryDate(): string {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1; // Months are 0-indexed

	// Generate a random year (3-5 years from now)
	const futureYear = currentYear + 3 + Math.floor(Math.random() * 3); // 3-5 years ahead
	const yearShort = futureYear.toString().slice(-2); // Last 2 digits

	// Generate a random month (1-12)
	const month = Math.floor(Math.random() * 12) + 1;
	const monthStr = month.toString().padStart(2, "0");

	return `${monthStr}/${yearShort}`;
}

function calculateLuhnCheckDigit(numStr: string): string {
	let sum = 0;
	for (let i = 0; i < numStr.length; i++) {
		let digit = parseInt(numStr.charAt(i));
		const isEven = (numStr.length - i) % 2 === 0;

		if (isEven) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
	}

	return ((10 - (sum % 10)) % 10) + "";
}

export function generateValidCardNumber(): string {
	// Generate first 15 digits randomly
	let digits = "";
	for (let i = 0; i < 15; i++) {
		digits += Math.floor(Math.random() * 10).toString();
	}

	// Calculate the Luhn check digit
	digits += calculateLuhnCheckDigit(digits);

	return digits;
}

export function generateCVV(): string {
	return Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
}
