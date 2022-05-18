import ParseHelper from './ParseHelper';

describe(ParseHelper, function () {
    let helper: ParseHelper;

    beforeEach(function () {
        helper = new ParseHelper();
    });

    it('should grab deep values in various ways', async function () {
        const json: object = {
            direct: 'test::direct:',
            list: [
                {
                    test: 'test::subObject:'
                }
            ]
        };
        expect(helper.get(json, 'direct', '')).toBe('test::direct:');
        expect(helper.get(json, 'list[0].test', '')).toBe('test::subObject:');
        expect(helper.get(json, 'list[0][\'test\']', '')).toBe('test::subObject:');
    });

    it('should return default values', async function () {
        const json: object = {
            direct: 'test::direct:',
            list: [
                {
                    test: 'test::subObject:'
                }
            ]
        };
        expect(helper.get(json, '.direct', 'test::default:')).toBe('test::default:');
        expect(helper.get(json, 'list[0]..test', 'test::default:')).toBe('test::default:');
        expect(helper.get(json, 'damn.test', 'test::default:')).toBe('test::default:');
        expect(helper.get(json, 'not_existing', 'test::default:')).toBe('test::default:');
        expect(helper.get(null, 'any', 'test::default:')).toBe('test::default:');
        expect(helper.get(undefined, 'any', 'test::default:')).toBe('test::default:');
    });
});
