import {StorageContainer} from './Storage';

export interface EncodedContainer {
    timestampOfSelectedMonth: number;
}

export default class Encoder {
    public encode(container: StorageContainer): string {
        const json: EncodedContainer = {
            timestampOfSelectedMonth: container.selectedMonth.valueOf()
        };
        return JSON.stringify(json);
    }
}
