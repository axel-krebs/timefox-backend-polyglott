export default class DateHelper {
    public toUnixTimestamp(date: Date) {
        let javaTimestamp: number = date.valueOf();

        return (javaTimestamp - javaTimestamp % 1000) / 1000;
    }
}
