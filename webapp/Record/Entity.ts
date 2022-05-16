export class TimeRecord {
    public hours: number = 0;
    public issue: string = '';
    public text: string = '';
}

export default class Entity {
    public date: Date = new Date();
    public timeRecords: TimeRecord[] = [];
}
