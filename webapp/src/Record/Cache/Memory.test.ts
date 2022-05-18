import Memory from './Memory';
import Entity from '../Entity';
import {EntityNotCached, RangeNotCached} from './Cache';
import {expectAsync} from '../../TestHelper';

describe(Memory, function () {
    let cache: Memory;

    beforeEach(function () {
        cache = new Memory();
    });

    it('should cache by date of record', async function () {
        const record: Entity = new Entity();
        record.date = new Date(12345);

        (await expectAsync(cache.takeByDate(new Date(12345)))).toThrowError(EntityNotCached);

        await cache.cacheRecord(record);

        const result: Entity = await cache.takeByDate(new Date(12345));
        expect(result).toBe(record);
    });

    it('should cache a record range', async function () {
        const records: Entity[] = [new Entity()];
        records[0].date = 'test::anyData:' as any;

        (await expectAsync(cache.takeRange(new Date(1), new Date(2)))).toThrowError(RangeNotCached);

        await cache.cacheRange(new Date(1), new Date(2), records);

        const result: Entity[] = await cache.takeRange(new Date(1), new Date(2));
        expect(result).not.toBe(records);
        expect(result).toEqual(records);
    });

    it('should invalidate data', async function () {
        const record: Entity = new Entity();
        record.date = new Date(12345);

        await cache.cacheRecord(record);
        await cache.cacheRange(new Date(1), new Date(2), [record]);

        cache.invalidate();

        (await expectAsync(cache.takeByDate(new Date(12345)))).toThrowError(EntityNotCached);
        (await expectAsync(cache.takeRange(new Date(1), new Date(2)))).toThrowError(RangeNotCached);
    });
});


