import StorageClient from './Storage';
import {mock, MockProxy} from 'jest-mock-extended';
import Encoder from './Encoder';
import Parser from './Parser';
import {IndexNotStored} from '../Client';
import {expectAsync} from '../../../TestHelper';

describe(StorageClient, function () {
    let client: StorageClient,
        storage: Storage & MockProxy<Storage>,
        encoder: Encoder & MockProxy<Encoder>,
        parser: Parser & MockProxy<Parser>
    ;

    beforeEach(function () {
        storage = mock<Storage>();
        encoder = mock<Encoder>();
        parser = mock<Parser>();
        client = new StorageClient(storage, encoder, parser);
    });

    async function runTestCase(input: any, expectedData: any, test: () => Promise<void>): Promise<void> {
        storage.getItem.mockReturnValue('test::sourceJson:');
        parser.parse.mockReturnValue(input);
        encoder.encode.mockReturnValue('test::targetJson:');

        await test();

        expect(encoder.encode).toBeCalledWith(expectedData);
        expect(storage.getItem).toBeCalledWith('TimeTracker::Form::Client');
        expect(parser.parse).toBeCalledWith('test::sourceJson:');
        expect(storage.setItem).toBeCalledWith('TimeTracker::Form::Client', 'test::targetJson:');
    }

    it('should set and get change flags', async function () {
        await runTestCase(
            {isChanged: false},
            {isChanged: true},
            async function (): Promise<void> {
                expect(await client.isChanged()).toBeFalsy();
                await client.setChanged(true);
            }
        );
    });

    it('should set and get hour', async function () {
        await runTestCase(
            {hour: 11},
            {hour: 12},
            async function (): Promise<void> {
                expect(await client.getHour()).toBe(11);
                await client.saveHour(12);
            }
        );
    });

    it('should set and get minute', async function () {
        await runTestCase(
            {minute: 11},
            {minute: 12},
            async function (): Promise<void> {
                expect(await client.getMinute()).toBe(11);
                await client.saveMinute(12);
            }
        );
    });

    it('should set and get issue', async function () {
        await runTestCase(
            {issue: 'test::get:'},
            {issue: 'test::set:'},
            async function (): Promise<void> {
                expect(await client.getIssue()).toBe('test::get:');
                await client.saveIssue('test::set:');
            }
        );
    });

    it('should set and get text', async function () {
        await runTestCase(
            {text: 'test::get:'},
            {text: 'test::set:'},
            async function (): Promise<void> {
                expect(await client.getText()).toBe('test::get:');
                await client.saveText('test::set:');
            }
        );
    });

    it('should set and get edit index', async function () {
        await runTestCase(
            {editIndex: 'test::get:'},
            {editIndex: 'test::set:'},
            async function (): Promise<void> {
                expect(await client.getEditIndex()).toBe('test::get:');
                await client.saveEditIndex('test::set:' as any);
            }
        );
    });

    it('should throw error on get undefined edit index', async function () {
        parser.parse.mockReturnValue({} as any);
        (await expectAsync(client.getEditIndex())).toThrowError(IndexNotStored);
    });
});
