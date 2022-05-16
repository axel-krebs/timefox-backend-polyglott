import StorageClient from './Storage';
import Parser from './Parser';
import Encoder from './Encoder';
import {mock, MockProxy} from 'jest-mock-extended';

describe(StorageClient, function () {
    let client: StorageClient,
        parser: Parser & MockProxy<Parser>,
        encoder: Encoder & MockProxy<Encoder>,
        storage: Storage & MockProxy<Storage>
    ;

    beforeEach(function () {
        storage = mock<Storage>();
        parser = mock<Parser>();
        encoder = mock<Encoder>();
        client = new StorageClient(storage, encoder, parser);
    });

    async function runTestCase(input: any, expectedData: any, test: () => Promise<void>): Promise<void> {
        storage.getItem.mockReturnValue('test::sourceJson:');
        parser.parse.mockReturnValue(input);
        encoder.encode.mockReturnValue('test::targetJson:');

        await test();

        expect(encoder.encode).toBeCalledWith(expectedData);
        expect(storage.getItem).toBeCalledWith('Report::Client');
        expect(parser.parse).toBeCalledWith('test::sourceJson:');
        expect(storage.setItem).toBeCalledWith('Report::Client', 'test::targetJson:');
    }

    it('should set and get selected month', async function () {
        await runTestCase(
            {selectedMonth: 'test::get:'},
            {selectedMonth: 'test::set:'},
            async function (): Promise<void> {
                expect(await client.getSelectedMonth()).toBe('test::get:');
                await client.saveSelectedMont('test::set:' as any);
            }
        );
    });
});
