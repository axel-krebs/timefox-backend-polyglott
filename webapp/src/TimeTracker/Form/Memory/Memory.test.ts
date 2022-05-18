import Memory from './Memory';
import {EditIndex, IndexNotStored} from '../Client';
import {expectAsync} from '../../../TestHelper';

describe(Memory, function () {
    let client: Memory;

    beforeEach(function () {
        client = new Memory();
    });

    it('should set and get edit index', async function () {
        const index: EditIndex = 'test::editIndex:' as any;
        (await expectAsync(client.getEditIndex())).toThrowError(IndexNotStored);
        await client.saveEditIndex(index);
        expect(await client.getEditIndex()).toBe(index);
    });

    it('should set and get hour', async function () {
        await client.saveHour(1);
        expect(await client.getHour()).toBe(1);
    });

    it('should set and get minute', async function () {
        await client.saveMinute(1);
        expect(await client.getMinute()).toBe(1);
    });

    it('should set and get issue', async function () {
        await client.saveIssue('test::code:');
        expect(await client.getIssue()).toBe('test::code:');
    });

    it('should set and get text', async function () {
        await client.saveText('test::text:');
        expect(await client.getText()).toBe('test::text:');
    });

    it('should set and get change flag', async function () {
        expect(await client.isChanged()).toBeFalsy();
        await client.setChanged(true);
        expect(await client.isChanged()).toBeTruthy();
    });
});
