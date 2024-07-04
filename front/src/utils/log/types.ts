export class LoggableResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    url: string;

    constructor(response: Response) {
        this.status = response.status;
        this.statusText = response.statusText;
        this.headers = Object.fromEntries(response.headers);
        this.url = response.url;
    }

    // Optional: Method to get the object as a plain JavaScript object
    toJSON() {
        return {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            url: this.url,
        };
    }
}
