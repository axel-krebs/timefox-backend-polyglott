import Client, {RecordNotFound} from '../Client';
import Entity from '../../Entity';
import Encoder from './Encoder';
import Parser from './Parser';
import FetchHelper from '../../../ApiHelper/FetchHelper';
import Method from '../../../ApiHelper/Method';

export default class Azure implements Client {
    constructor(
        private encoder: Encoder,
        private parser: Parser,
        private fetchHelper: FetchHelper
    ) {
    }

    public async loadRange(start: Date, end: Date): Promise<Entity[]> {
        const response: Response = await fetch(
            this.encoder.encodeRangeLoadUri(start, end),
            this.fetchHelper.createHeader(Method.GET)
        );

        if (this.fetchHelper.isResponseSuccessful(response) == false) return [];

        return this.parser.parseRecordRange(await response.json());
    }

    public async updateRecord(record: Entity): Promise<void> {
        await fetch(
            this.encoder.encodeRecordWriteUri(),
            this.fetchHelper.createHeader(
                Method.POST,
                JSON.stringify(this.encoder.encodeRecord(record))
            )
        );
    }

    public async loadRecord(date: Date): Promise<throwsErrorOrReturn<RecordNotFound, Entity>> {
        const response: Response = await fetch(
            this.encoder.encodeRecordLoadUri(date),
            this.fetchHelper.createHeader(Method.GET)
        );

        if (this.fetchHelper.isResponseSuccessful(response) == false) throw new RecordNotFound();

        return this.parser.parseRecord(await response.json());
    }

    public async createRecord(record: Entity): Promise<Entity> {
        const response: Response = await fetch(
            this.encoder.encodeRecordWriteUri(),
            this.fetchHelper.createHeader(
                Method.POST,
                JSON.stringify(this.encoder.encodeRecord(record))
            )
        );

        if (this.fetchHelper.isResponseSuccessful(response) == false) return record;

        return this.parser.parseRecord(await response.json());
    }
}
