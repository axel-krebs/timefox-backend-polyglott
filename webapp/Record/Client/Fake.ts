import Client, {RecordNotFound} from './Client';
import Entity from '../Entity';

export default class Fake implements Client {
    private readonly memory: Entity[] = [];

    constructor() {
        this.memory = this.generateFakeRecords();
    }

    public async loadRange(start: Date, end: Date): Promise<Entity[]> {
        const entities: Entity[] = this.memory.filter(
            (e: Entity): boolean => e.date.valueOf() >= start.valueOf() && e.date.valueOf() <= end.valueOf()
        );
        console.log('loadRange(', start, ',', end, '):', entities);
        return entities;
    }

    public async updateRecord(record: Entity): Promise<void> {
        console.log('updateRecord(', record, '): void');
        type IndexObject = { entity: Entity, index: number };
        const indexes: number[] = this.memory
            .map((e: Entity, i: number): IndexObject => {
                return {entity: e, index: i};
            })
            .filter((o: IndexObject) => o.entity.date.valueOf() == record.date.valueOf())
            .map((o: IndexObject) => o.index)
        ;
        this.memory[indexes[0]] = record;
    }

    public async loadRecord(date: Date): Promise<throwsErrorOrReturn<RecordNotFound, Entity>> {
        const result: Entity[] = this.memory
            .filter((e: Entity): boolean => e.date.valueOf() == date.valueOf())
        ;
        if (result.length == 0) throw new RecordNotFound('Record not found.');
        console.log('loadRecord(', date, '):', result[0]);
        return result[0];
    }

    public async createRecord(record: Entity): Promise<Entity> {
        console.log('createRecord(', record, '):', record);
        this.memory.push(record);
        return record;
    }

    private generateFakeRecords(): Entity[] {
        const records: Entity[] = [];
        const currentDate = new Date();
        const monthArray: Date[] = this.getAllDatesInMonth(currentDate.getFullYear(), currentDate.getMonth());
        monthArray.forEach(function (date: Date) {
            const record: Entity = new Entity();
            record.date = new Date(date);
            record.timeRecords = [
                {hours: 1.25, issue: 'TIM-71', text: 'Fake Daten[' + record.date.getDate() + '] der TimeRecords'},
                {hours: 3, issue: 'TIM-71', text: 'Fake Daten der Berichte'}
            ];
            records.push(record);
        });

        return this.unSortRandom(records);
    }

    private getAllDatesInMonth(year: number, month: number): Date[] {
        const date: Date = new Date(year, month);
        const dates: Date[] = [];
        while (date.getMonth() === month) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }

    private unSortRandom(records: Entity[]): Entity[] {
        return records.sort(() => Math.random() - 0.5)
    }
}
