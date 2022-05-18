import Fake from './Fake';
import Entity, {TimeRecord} from '../Entity';
import {RecordNotFound} from './Client';
import {expectAsync} from '../../TestHelper';

const origLog: any = console.log;

describe(Fake, function () {
    let client: Fake, now: Date;

    beforeEach(function () {
        client = new Fake();
        console.log = () => '';
        now = new Date();
    });

    afterEach(function () {
        console.log = origLog;
    });

    it('should load fake data', async function () {
        expect(await client.loadRange(
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth(), 2)
        )).toHaveLength(2);
    });

    it('should create new data', async function () {
        const entity: Entity = new Entity();
        entity.date = new Date(now.getFullYear(), now.getMonth() + 20, 1);
        await client.createRecord(entity);
        expect(await client.loadRange(
            new Date(now.getFullYear(), now.getMonth() + 20, 1),
            new Date(now.getFullYear(), now.getMonth() + 20, 2)
        )).toHaveLength(1);
    });

    it('should update new data', async function () {
        const data: Entity = (await client.loadRange(
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth(), 2)
        ))[1];
        data.timeRecords = [new TimeRecord(), new TimeRecord(), new TimeRecord()];
        await client.updateRecord(data);
        expect((await client.loadRange(
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth(), 2)
        ))[1].timeRecords).toHaveLength(3);
    });

    it('should load a record', async function () {
        const now: Date = new Date();
        const requestedDate: Date = new Date(now.getFullYear(), now.getMonth(), 1);
        const result: Entity = await client.loadRecord(requestedDate);
        expect(result.timeRecords[0].text).toBe('Fake Daten[1] der TimeRecords');
    });

    it('should return error on loading a non existing record', async function () {
        (await expectAsync(client.loadRecord(new Date(0)))).toThrowError(RecordNotFound);
    });
});
