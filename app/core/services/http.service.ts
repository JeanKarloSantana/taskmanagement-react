export class HttpService {
    public async post(domain: string, url: string, body: unknown, headers?: Record<string, string>) {
        const requestHeaders = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        requestHeaders.set('Accept', 'application/json');

        if (headers) {
            Object.entries(headers).forEach(([name, value]) => {
                requestHeaders.set(name, value);
            });
        }

        const request = {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(body)
        }

        const response = await fetch(`${domain}/${url}`, request);

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `Login failed: ${response.status}`);
        }

        return await response.json();
    }
}   

