import FetchHelper from './FetchHelper';
import {mock, MockProxy} from 'jest-mock-extended';
import Method from './Method';

describe(FetchHelper, function () {
    let helper: FetchHelper;

    beforeEach(function () {
        helper = new FetchHelper();
    });

    it('should create config with method', function () {
        const result: RequestInit = helper.createHeader(Method.POST);
        expect(result.method).toEqual('POST');
    });

    it('should create config with body', function () {
        const body: string = '{"file": "data"}';
        const result: RequestInit = helper.createHeader(Method.POST, body);
        expect(result.method).toEqual('POST');
        expect(result.body).toEqual(body);
    });

    it('should create config for form data in body', function () {
        const body: FormData = new FormData();
        const actual: RequestInit = helper.createHeader(Method.POST, body);

        expect(actual.method).toBe('POST');
        expect(actual.body).toBe(body);
    });

    it('should check http status of response', function () {
        const response: MockProxy<Response> = mock<Response>();
        (response as any).status = 200;
        expect(helper.isResponseSuccessful(response)).toBeTruthy();
        (response as any).status = 399;
        expect(helper.isResponseSuccessful(response)).toBeTruthy();
        (response as any).status = 401;
        expect(helper.isResponseSuccessful(response)).toBeFalsy();
        (response as any).status = 199;
        expect(helper.isResponseSuccessful(response)).toBeFalsy();
    });
});
