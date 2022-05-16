import Entity, {TimeRecord} from '../../Entity';
import ParseHelper from '../../../ParseHelper';
import EncodedRange from './EncodedRange';
import EncodedRecord, {EncodedTimeRecord} from './EncodedRecord';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parseRecordRange(json: EncodedRange): Entity[] {
        return this.parseHelper.get<EncodedRecord[]>(json, 'records', [])
            .map(this.parseRecord.bind(this))
            ;
    }

    public parseRecord(json: EncodedRecord): Entity {
        const entity: Entity = new Entity();
        entity.date = new Date(this.parseHelper.get<number>(json, 'date', 0) * 1000);
        entity.timeRecords = this.parseHelper.get<EncodedTimeRecord[]>(json, 'timeRecords', [])
            .map(this.parseTimeRecord.bind(this))
        ;
        return entity;
    }

    private parseTimeRecord(json: EncodedTimeRecord): TimeRecord {
        const timeRecord: TimeRecord = new TimeRecord();
        timeRecord.text = this.parseHelper.get<string>(json, 'text', '');
        timeRecord.hours = this.parseHelper.get<number>(json, 'hours', 0);
        return timeRecord;
    }
}
