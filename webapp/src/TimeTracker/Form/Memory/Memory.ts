import Client, {EditIndex, IndexNotStored} from '../Client';

export default class Memory implements Client {
    private editIndex: EditIndex | undefined;
    private hour: number = 0;
    private minute: number = 0;
    private issue: string = '';
    private text: string = '';
    private isChangedFlag: boolean = false;

    public async isChanged(): Promise<boolean> {
        return this.isChangedFlag;
    }

    public async setChanged(isChanged: boolean): Promise<void> {
        this.isChangedFlag = isChanged;
    }

    public async getHour(): Promise<number> {
        return this.hour;
    }

    public async saveHour(hour: number): Promise<void> {
        this.hour = hour;
    }

    public async getMinute(): Promise<number> {
        return this.minute;
    }

    public async saveMinute(minute: number): Promise<void> {
        this.minute = minute;
    }

    public async getIssue(): Promise<string> {
        return this.issue;
    }

    public async saveIssue(code: string): Promise<void> {
        this.issue = code;
    }

    public async getText(): Promise<string> {
        return this.text;
    }

    public async saveText(text: string): Promise<void> {
        this.text = text;
    }

    public async getEditIndex(): Promise<throwsErrorOrReturn<IndexNotStored, EditIndex>> {
        if (this.editIndex === undefined) throw new IndexNotStored();
        return this.editIndex;
    }

    public async saveEditIndex(index: EditIndex): Promise<void> {
        this.editIndex = index;
    }
}
