import {StorageContainer} from './Storage';
import {EditIndex, Week} from '../Client';
import {EncodedContainer, EncodedEditIndex, EncodedWeek} from './Encoder';
import ParseHelper from '../../../ParseHelper';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parse(json: string | null): StorageContainer {
        const result: StorageContainer = {
            hour: 0,
            editIndex: undefined,
            isChanged: false,
            issue: '',
            minute: 0,
            text: ''
        };
        if (json === null) return result;

        const data: EncodedContainer = JSON.parse(json);
        result.hour = this.parseHelper.get<number>(data, 'hour', 0);
        result.isChanged = this.parseHelper.get<boolean>(data, 'isChanged', false);
        result.issue = this.parseHelper.get<string>(data, 'issue', '');
        result.minute = this.parseHelper.get<number>(data, 'minute', 0);
        result.text = this.parseHelper.get<string>(data, 'text', '');
        result.editIndex =
            this.parseEditIndex(this.parseHelper.get<EncodedEditIndex | undefined>(data, 'editIndex', undefined));

        return result;
    }

    private parseEditIndex(data?: EncodedEditIndex): EditIndex | undefined {
        if (data === undefined) return;
        return {
            selectedDay: new Date(this.parseHelper.get<number>(data, 'timestampOfSelectedDay', 0)),
            rowIndex: this.parseHelper.get<number>(data, 'rowIndex', 0),
            focusIndex: this.parseHelper.get<number>(data, 'focusIndex', 0),
            week: this.parseWeek(this.parseHelper.get<EncodedWeek>(data, 'selectedWeek', {start: 0, end: 0})),
            dayOfLastSelection: new Date(this.parseHelper.get<number>(data, 'timestampOfLastSelection', 0))
        };
    }

    private parseWeek(week: EncodedWeek): Week {
        return {
            start: new Date(this.parseHelper.get<number>(week, 'start', 0)),
            end: new Date(this.parseHelper.get<number>(week, 'end', 0))
        };
    }
}
