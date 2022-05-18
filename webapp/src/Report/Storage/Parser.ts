import ParseHelper from '../../ParseHelper';
import {EncodedContainer} from './Encoder';
import {StorageContainer} from './Storage';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parse(json: string | null): StorageContainer {
        const result: StorageContainer = {
            selectedMonth: new Date()
        };
        if (json === null) return result;
        const data: EncodedContainer = JSON.parse(json);
        result.selectedMonth = new Date(this.parseHelper.get<number>(data, 'timestampOfSelectedMonth', 0));

        return result;
    }
}
