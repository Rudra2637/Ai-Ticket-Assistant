import crypto from 'crypto'


/**
 * Hashes a plain password using Node.js built-in scrypt.
 * Returns a salt:hash string.
 */

export function hashPassword (password) {
    if(!password) {
        throw new Error('Enter a password to proceed further')
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password,salt,64).toString('hex');

    return `${salt}:${hash}`;
}

export function verifyPassword(password,storedHash) {
    if(!password) {
        return false
    }

    try {
        const [salt,key] = storedHash.split(':');
        const keyBuffer = Buffer.from(key, 'hex');
        const derivedKey = crypto.scryptSync(password,salt,64);
        return crypto.timingSafeEqual(keyBuffer, derivedKey);
    }
    catch {
        return false;
    }
}