import Encoder from './Encoder';

describe(Encoder, function () {
    let encoder: Encoder;

    beforeEach(function () {
        encoder = new Encoder();
    });

    it('should encodes the storage container', function () {
        const result: string = encoder.encode(
            {
                selectedMonth: new Date(1970, 0, 1, 0, 0, 0, 0)
            }
        );
        expect(result).toBe(
            JSON.stringify(
                {
                    timestampOfSelectedMonth: new Date(0).getTimezoneOffset() * 60000
                }
            )
        );
    });
});
