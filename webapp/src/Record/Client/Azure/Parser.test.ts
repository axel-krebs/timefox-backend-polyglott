import Parser from './Parser';
import ParseHelper from '../../../ParseHelper';
import EncodedRange from './EncodedRange';
import Entity from '../../Entity';
import EncodedRecord from './EncodedRecord';

describe(Parser, function () {
    let parser: Parser;

    beforeEach(function () {
        parser = new Parser(new ParseHelper());
    });

    it('should parse record range', async function () {
        const json: EncodedRange = {
            records: [
                {
                    date: 123456,
                    timeRecords: [
                        {
                            hours: 1,
                            text: 'test::text:'
                        }
                    ]
                }
            ]
        };

        const result: Entity[] = parser.parseRecordRange(json);

        expect(result).toHaveLength(1);
        expect(result[0].date).toEqual(new Date(123456000));
        expect(result[0].timeRecords).toHaveLength(1);
        expect(result[0].timeRecords[0].hours).toBe(1);
        expect(result[0].timeRecords[0].text).toBe('test::text:');
    });

    it('should parse record', async function () {
        const json: EncodedRecord = {
            date: 123456,
            timeRecords: [
                {
                    hours: 1,
                    text: 'test::text:'
                }
            ]
        };

        const result: Entity = parser.parseRecord(json);

        expect(result.date).toEqual(new Date(123456000));
        expect(result.timeRecords).toHaveLength(1);
        expect(result.timeRecords[0].hours).toBe(1);
        expect(result.timeRecords[0].text).toBe('test::text:');
    });
});
