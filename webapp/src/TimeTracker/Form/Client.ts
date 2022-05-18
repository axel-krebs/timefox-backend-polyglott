export interface Week {
    start: Date,
    end: Date
}

export interface EditIndex {
    rowIndex: number,
    selectedDay: Date,
    week: Week,
    focusIndex: number,
    dayOfLastSelection: Date
}

export class IndexNotStored extends Error {
}

export default interface Client {
    isChanged(): Promise<boolean>;

    setChanged(isChanged: boolean): Promise<void>;

    getHour(): Promise<number>;

    saveHour(hour: number): Promise<void>;

    getMinute(): Promise<number>;

    saveMinute(minute: number): Promise<void>;

    getIssue(): Promise<string>;

    saveIssue(code: string): Promise<void>;

    getText(): Promise<string>;

    saveText(text: string): Promise<void>;

    getEditIndex(): Promise<throwsErrorOrReturn<IndexNotStored, EditIndex>>;

    saveEditIndex(index: EditIndex): Promise<void>;
}
