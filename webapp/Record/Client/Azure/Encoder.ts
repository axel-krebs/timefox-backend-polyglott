import Config from './Config';
import DateHelper from '../../../DateHelper';
import Entity, {TimeRecord} from '../../Entity';
import EncodedRecord, {EncodedTimeRecord} from './EncodedRecord';

export default class Encoder {
    constructor(
        private config: Config,
        private dateHelper: DateHelper
    ) {
    }

    public encodeRangeLoadUri(start: Date, end: Date): string {
        return this.config.loadRangeEndpoint
            .replace('{start}', this.dateHelper.toUnixTimestamp(start).toString())
            .replace('{end}', this.dateHelper.toUnixTimestamp(end).toString())
            ;
    }

    public encodeRecordWriteUri(): string {
        return this.config.writeRecordEndpoint;
    }

    public encodeRecordLoadUri(date: Date): string {
        return this.config.loadRecordEndpoint
            .replace('{timestamp}', this.dateHelper.toUnixTimestamp(date).toString())
            ;
    }

    public encodeRecord(record: Entity): EncodedRecord {
        return {
            date: this.dateHelper.toUnixTimestamp(record.date),
            timeRecords: record.timeRecords.map(this.encodeTimeRecord.bind(this))
        };
    }

    private encodeTimeRecord(timeRecord: TimeRecord): EncodedTimeRecord {
        return {
            hours: timeRecord.hours,
            text: timeRecord.text
        };
    }
}
