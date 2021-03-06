import Method from './Method';

export default class FetchHelper {
    public createHeader(method: Method, body?: BodyInit): RequestInit {
        const isFileUpload: boolean = body instanceof FormData;
        const headers: any = {};
        if (!isFileUpload) {
            headers['content-type'] = 'application/json';
        }
        const headerData: RequestInit = {
            method: method,
            headers: new Headers(headers)
        } as RequestInit;
        if (body) {
            headerData.body = body;
        }
        return headerData;
    }

    public isResponseSuccessful(response: Response): boolean {
        return response.status >= 200 && response.status < 400;
    }
}
