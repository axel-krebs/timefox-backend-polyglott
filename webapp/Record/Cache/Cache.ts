import Entity from '../Entity';

export class EntityNotCached extends Error {
}

export class RangeNotCached extends Error {
}

export default interface Cache {
    takeByDate(date: Date): Promise<throwsErrorOrReturn<EntityNotCached, Entity>>;

    cacheRecord(record: Entity): Promise<void>;

    takeRange(start: Date, end: Date): Promise<throwsErrorOrReturn<RangeNotCached, Entity[]>>;

    cacheRange(start: Date, end: Date, records: Entity[]): Promise<void>;

    invalidate(): void;
}
