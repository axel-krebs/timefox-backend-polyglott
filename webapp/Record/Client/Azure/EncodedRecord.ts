export interface EncodedTimeRecord {
    text: string,
    hours: number
}

export default interface EncodedRecord {
    date: number,
    timeRecords: EncodedTimeRecord[]
}
