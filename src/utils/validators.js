/**
 * Validates an email address and checks for common domain typos.
 * @param {string} email - The email address to validate.
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: 'Email is required.' };
    }

    // Basic regex for format validation
    // Allows standard email format: local@domain.tld
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
    }

    const [localPart, domainPart] = email.split('@');
    if (!domainPart) {
        return { isValid: false, error: 'Invalid email format.' };
    }

    const domain = domainPart.toLowerCase();

    // List of common domains to check against
    const commonDomains = [
        'gmail.com',
        'yahoo.com',
        'yahoo.it',
        'outlook.com',
        'outlook.it',
        'hotmail.com',
        'hotmail.it',
        'icloud.com',
        'libero.it',
        'tiscali.it',
        'virgilio.it',
        'alice.it'
    ];

    // Typo map for specific known typos to their corrections
    const knownTypos = {
        'ail.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gmal.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'gamail.com': 'gmail.com',
        'yhoo.com': 'yahoo.com',
        'yaho.com': 'yahoo.com',
        'outlok.com': 'outlook.com',
        'hotmal.com': 'hotmail.com',
        'hotmai.com': 'hotmail.com',
        'liber.it': 'libero.it',
        'tiscal.it': 'tiscali.it',
        'virgili.it': 'virgilio.it'
    };

    // Check for direct typo matches
    if (knownTypos[domain]) {
        return {
            isValid: false,
            error: `Did you mean @${knownTypos[domain]}?`
        };
    }

    // Advanced Levenshtein distance check could go here, 
    // but specific typo map covers the requested user case reliably and efficiently.

    // Check for "gmail" typo variations not in map but very close
    if (domain.includes('gmail') && domain !== 'gmail.com') {
        // e.g. gmail.co, gmail.cm, gmailc.om
        if (domain.endsWith('.co') || domain.endsWith('.cm') || domain === 'gmail.it') {
            return { isValid: false, error: `Did you mean @gmail.com?` };
        }
    }

    return { isValid: true, error: null };
};
