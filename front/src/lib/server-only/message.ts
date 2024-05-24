export function extractErrorMessage(message: string): string {
    if (typeof message !== 'string') {
        return ''; // Return empty string for non-string input
    }

    const splitMessage = message.split(':');
    if (splitMessage.length < 2) {
        return message; // Return original message if not in expected format
    }

    const extractedMessage = splitMessage[1].trim();
    return extractedMessage;
}
