import Entity from '../Entity';

export class RecordNotFound extends Error {
}

export default interface Client {
    loadRange(start: Date, end: Date): Promise<Entity[]>;

    updateRecord(record: Entity): Promise<void>;

    loadRecord(date: Date): Promise<throwsErrorOrReturn<RecordNotFound, Entity>>;

    createRecord(record: Entity): Promise<Entity>;
}
