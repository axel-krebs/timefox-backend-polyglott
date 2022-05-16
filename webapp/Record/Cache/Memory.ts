import Cache, {EntityNotCached, RangeNotCached} from './Cache';
import Entity from '../Entity';

export default class Memory implements Cache {
    private memory: Map<string, Entity[]> = new Map<string, Entity[]>();

    public async takeByDate(date: Date): Promise<throwsErrorOrReturn<EntityNotCached, Entity>> {
        if (this.memory.has(date.valueOf().toString()) == false) throw new EntityNotCached();
        return (this.memory.get(date.valueOf().toString()) as Entity[])[0];
    }

    public async cacheRecord(record: Entity): Promise<void> {
        this.memory.set(record.date.valueOf().toString(), [record]);
    }

    public async takeRange(start: Date, end: Date): Promise<throwsErrorOrReturn<RangeNotCached, Entity[]>> {
        const key: string = start.valueOf().toString() + ':' + end.valueOf().toString();
        if (this.memory.has(key) == false) throw new RangeNotCached();
        return (this.memory.get(key) as Entity[]).map(e => e);
    }

    public async cacheRange(start: Date, end: Date, records: Entity[]): Promise<void> {
        const key: string = start.valueOf().toString() + ':' + end.valueOf().toString();
        this.memory.set(key, records);
    }

    public invalidate(): void {
        this.memory.clear();
    }
}
