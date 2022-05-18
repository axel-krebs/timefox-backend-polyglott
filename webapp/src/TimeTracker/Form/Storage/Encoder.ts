import {StorageContainer} from './Storage';
import {EditIndex} from '../Client';

export interface EncodedWeek {
    start: number;
    end: number;
}

export interface EncodedEditIndex {
    timestampOfSelectedDay: number;
    rowIndex: number;
    focusIndex: number;
    selectedWeek: EncodedWeek;
    timestampOfLastSelection: number;
}

export interface EncodedContainer {
    hour: number;
    issue: string;
    editIndex: EncodedEditIndex | undefined;
    isChanged: boolean;
    text: string;
    minute: number;
}

export default class Encoder {
    public encode(container: StorageContainer): string {
        const json: EncodedContainer = {
            editIndex: this.encodeEditIndex(container.editIndex),
            hour: container.hour,
            minute: container.minute,
            isChanged: container.isChanged,
            issue: container.issue,
            text: container.text
        };
        return JSON.stringify(json);
    }

    private encodeEditIndex(editIndex?: EditIndex): EncodedEditIndex | undefined {
        if (editIndex === undefined) return;
        return {
            timestampOfSelectedDay: editIndex.selectedDay.valueOf(),
            timestampOfLastSelection: editIndex.dayOfLastSelection.valueOf(),
            rowIndex: editIndex.rowIndex,
            focusIndex: editIndex.focusIndex,
            selectedWeek: {
                start: editIndex.week.start.valueOf(),
                end: editIndex.week.end.valueOf()
            }
        };
    }
}
