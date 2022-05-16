import Encoder, {EncodedContainer} from './Encoder';
import {StorageContainer} from './Storage';

describe(Encoder, function () {
    let encoder: Encoder;

    beforeEach(function () {
        encoder = new Encoder();
    });

    it('should encodes the storage container', function () {
        const result: string = encoder.encode(
            {
                hour: 1,
                editIndex: {
                    selectedDay: new Date(1970, 0, 1, 0, 0, 0, 0),
                    rowIndex: 3,
                    focusIndex: 6,
                    week: {
                        start: new Date(4),
                        end: new Date(5)
                    },
                    dayOfLastSelection: new Date(7)
                },
                isChanged: true,
                issue: 'test::issue:',
                minute: 2,
                text: 'test::text:'
            } as StorageContainer
        );
        expect(result).toBe(
            JSON.stringify(
                {
                    editIndex: {
                        timestampOfSelectedDay: new Date(0).getTimezoneOffset() * 60000,
                        timestampOfLastSelection: 7,
                        rowIndex: 3,
                        focusIndex: 6,
                        selectedWeek: {
                            start: 4,
                            end: 5
                        }
                    },
                    hour: 1,
                    minute: 2,
                    isChanged: true,
                    issue: 'test::issue:',
                    text: 'test::text:'
                } as EncodedContainer
            )
        );
    });

    it('should encodes undefined edit index', function () {
        const result: string = encoder.encode(
            {
                hour: 1,
                editIndex: undefined,
                isChanged: true,
                issue: 'test::issue:',
                minute: 2,
                text: 'test::text:'
            } as StorageContainer
        );
        expect(result).toBe(
            JSON.stringify(
                {
                    hour: 1,
                    minute: 2,
                    isChanged: true,
                    issue: 'test::issue:',
                    text: 'test::text:'
                } as EncodedContainer
            )
        );
    });
});
