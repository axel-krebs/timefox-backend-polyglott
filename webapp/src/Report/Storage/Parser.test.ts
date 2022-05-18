import Parser from './Parser';
import ParseHelper from '../../ParseHelper';
import {EncodedContainer} from './Encoder';
import {StorageContainer} from './Storage';

describe(Parser, function () {
    let parser: Parser;

    beforeEach(function () {
        parser = new Parser(
            new ParseHelper()
        );
    });
    
    it('should parse json string', function () {
        const json: string = JSON.stringify(
            {
                timestampOfSelectedMonth: new Date(0).getTimezoneOffset() * 60000
            } as EncodedContainer
        );
        const result: StorageContainer = parser.parse(json);
        expect(result).toEqual(
            {
                selectedMonth: new Date(1970, 0, 1, 0, 0, 0, 0)
            }
        );
    });
});
