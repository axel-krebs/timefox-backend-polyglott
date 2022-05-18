import DateHelper from './DateHelper';

describe(DateHelper, function () {
    let helper: DateHelper;

    beforeEach(function () {
        helper = new DateHelper();
    });

    it('should convert date to unix timestamp', async function () {
        expect(helper.toUnixTimestamp(new Date(123456789))).toBe(123456);
    });
});
