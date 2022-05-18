import Azure from './Azure';
import {mock, MockProxy} from 'jest-mock-extended';
import Encoder from './Encoder';
import Parser from './Parser';
import FetchHelper from '../../../ApiHelper/FetchHelper';
import Entity from '../../Entity';
import Method from '../../../ApiHelper/Method';
import {expectAsync} from '../../../TestHelper';
import {RecordNotFound} from '../Client';
import Mock = jest.Mock;

describe(Azure, function () {
    let client: Azure,
        fetch: Mock,
        response: Response & MockProxy<Response>,
        encoder: Encoder & MockProxy<Encoder>,
        parser: Parser & MockProxy<Parser>,
        fetchHelper: FetchHelper & MockProxy<FetchHelper>
    ;

    beforeEach(function () {
        encoder = mock<Encoder>();
        parser = mock<Parser>();
        fetchHelper = mock<FetchHelper>();
        response = mock<Response>();

        client = new Azure(
            encoder,
            parser,
            fetchHelper
        );

        fetch = jest.fn();
        fetch.mockResolvedValue(response);
        global.fetch = fetch;
    });

    it('should load range from Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(true);
        encoder.encodeRangeLoadUri.mockReturnValue('test::encodedEndpoint:');
        parser.parseRecordRange.mockReturnValue('test::decodedEntities:' as any);
        response.json.mockResolvedValue('test::json:');

        const result: Entity[] = await client.loadRange(new Date(1), new Date(2));

        expect(fetchHelper.createHeader).toBeCalledWith(Method.GET);
        expect(encoder.encodeRangeLoadUri).toBeCalledWith(new Date(1), new Date(2));
        expect(fetch).toBeCalledWith('test::encodedEndpoint:', 'test::requestInit:');
        expect(fetchHelper.isResponseSuccessful).toBeCalledWith(response);
        expect(parser.parseRecordRange).toBeCalledWith('test::json:');
        expect(result).toBe('test::decodedEntities:');
    });

    it('should ignore errors while load range from Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(false);
        encoder.encodeRangeLoadUri.mockReturnValue('test::encodedEndpoint:');

        const result: Entity[] = await client.loadRange(new Date(1), new Date(2));

        expect(parser.parseRecordRange).not.toBeCalled();
        expect(result).toEqual([]);
    });

    it('should load record from Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(true);
        encoder.encodeRecordLoadUri.mockReturnValue('test::encodedEndpoint:');
        parser.parseRecord.mockReturnValue('test::decodedEntity:' as any);
        response.json.mockResolvedValue('test::json:');

        const result: Entity = await client.loadRecord(new Date(1));

        expect(fetchHelper.createHeader).toBeCalledWith(Method.GET);
        expect(encoder.encodeRecordLoadUri).toBeCalledWith(new Date(1));
        expect(fetch).toBeCalledWith('test::encodedEndpoint:', 'test::requestInit:');
        expect(fetchHelper.isResponseSuccessful).toBeCalledWith(response);
        expect(parser.parseRecord).toBeCalledWith('test::json:');
        expect(result).toBe('test::decodedEntity:');
    });

    it('should throw error on non existent entity in Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(false);

        (await expectAsync(client.loadRecord(new Date(1)))).toThrowError(RecordNotFound);

        expect(parser.parseRecord).not.toBeCalled();
    });

    it('should create record in Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(true);
        encoder.encodeRecordWriteUri.mockReturnValue('test::encodedEndpoint:');
        encoder.encodeRecord.mockReturnValue({json: 'test::encodedEntity:'} as any);
        parser.parseRecord.mockReturnValue('test::decodedEntity:' as any);
        response.json.mockResolvedValue('test::json:');

        const result: Entity = await client.createRecord('test::recordEntity:' as any);

        expect(fetchHelper.createHeader).toBeCalledWith(Method.POST, '{"json":"test::encodedEntity:"}');
        expect(encoder.encodeRecordWriteUri).toBeCalled();
        expect(encoder.encodeRecord).toBeCalledWith('test::recordEntity:');
        expect(fetch).toBeCalledWith('test::encodedEndpoint:', 'test::requestInit:');
        expect(fetchHelper.isResponseSuccessful).toBeCalledWith(response);
        expect(parser.parseRecord).toBeCalledWith('test::json:');
        expect(result).toBe('test::decodedEntity:');
    });

    it('should ignore error while creating record in Azure', async function () {
        const entity: Entity = new Entity();
        entity.date = 'test::dummy:' as any;

        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        fetchHelper.isResponseSuccessful.mockReturnValue(false);
        encoder.encodeRecordWriteUri.mockReturnValue('test::encodedEndpoint:');
        encoder.encodeRecord.mockReturnValue({json: 'test::encodedEntity:'} as any);

        const result: Entity = await client.createRecord(entity);

        expect(parser.parseRecord).not.toBeCalled();
        expect(result).toBe(entity);
    });

    it('should overwrite record in Azure', async function () {
        fetchHelper.createHeader.mockReturnValue('test::requestInit:' as any);
        encoder.encodeRecordWriteUri.mockReturnValue('test::encodedEndpoint:');
        encoder.encodeRecord.mockReturnValue({json: 'test::encodedEntity:'} as any);

        await client.updateRecord('test::recordEntity:' as any);

        expect(fetchHelper.createHeader).toBeCalledWith(Method.POST, '{"json":"test::encodedEntity:"}');
        expect(encoder.encodeRecordWriteUri).toBeCalled();
        expect(encoder.encodeRecord).toBeCalledWith('test::recordEntity:');
        expect(fetch).toBeCalledWith('test::encodedEndpoint:', 'test::requestInit:');
    });
});
