import Parser from './Parser';
import {StorageContainer} from './Storage';
import {EncodedContainer} from './Encoder';
import ParseHelper from '../../../ParseHelper';

describe(Parser, function () {
    let parser: Parser;

    beforeEach(function () {
        parser = new Parser(
            new ParseHelper()
        );
    });

    it('should parse null string', function () {
        const result: StorageContainer = parser.parse(null);
        expect(result).toEqual(
            {
                hour: 0,
                isChanged: false,
                issue: '',
                minute: 0,
                text: ''
            } as StorageContainer
        );
    });

    it('should parse empty object', function () {
        const result: StorageContainer = parser.parse('{}');
        expect(result).toEqual(
            {
                hour: 0,
                isChanged: false,
                issue: '',
                minute: 0,
                text: ''
            } as StorageContainer
        );
    });

    it('should parse json string', function () {
        const json: string = JSON.stringify(
            {
                hour: 1,
                minute: 2,
                issue: 'test::issue:',
                text: 'test::text:',
                editIndex: {
                    timestampOfSelectedDay: new Date(0).getTimezoneOffset() * 60000,
                    rowIndex: 3,
                    focusIndex: 6,
                    selectedWeek: {
                        start: 4,
                        end: 5
                    },
                    timestampOfLastSelection: 7
                },
                isChanged: true
            } as EncodedContainer
        );
        const result: StorageContainer = parser.parse(json);
        expect(result).toEqual(
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
    });

    it('should parse undefined edit index', function () {
        const json: string = JSON.stringify(
            {
                hour: 1,
                minute: 2,
                issue: 'test::issue:',
                text: 'test::text:',
                isChanged: true
            } as EncodedContainer
        );
        const result: StorageContainer = parser.parse(json);
        expect(result.editIndex).toBeUndefined();
    });
});
