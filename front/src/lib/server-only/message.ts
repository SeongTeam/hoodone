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

/** "requestCertifiedMail(toEmail: string)" 에 response 값을 확인할떄 상용합니다.
 *
 * backend에서는 이메일 요청이 성공하면'250 2.0.0 OK  1716551382 d2e1a72fcca58-6f8fcbea886sm952420b3a.137 - gsmtp',
 * 형식으로 보낼 줄 예정입니다.
 */
export function extractStatusMessage(responseString: string): string | null {
    const regex = '250 2.0.0 OK';
    const match = responseString.match(regex);

    if (match) {
        return match[0];
    } else {
        console.error('Error: Unable to extract message using regex');
        return null; // Return null if extraction fails
    }
}

// const responseString = '250 2.0.0 OK 1716551382 d2e1a72fcca58-6f8fcbea886sm952420b3a.137 - gsmtp';
// const extractedMessage = extractStatusMessage(responseString);

// if (extractedMessage) {
//     console.log(extractedMessage); // Output: "250 2.0.0 OK"
// } else {
// }
