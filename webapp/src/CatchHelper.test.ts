import CatchHelper from './CatchHelper';

class TestError extends Error {
}

class OtherTestError extends Error {
}

describe(CatchHelper, function () {
    it('should throw on unexpected errors', function () {
        function testException() {
            try {
                (null as any).replace('a', 'b');
            } catch (e) {
                CatchHelper.assertError(e);
            }
        }

        expect(() => testException()).toThrowError();
    });

    it('should not react on expected errors', function () {
        function testException() {
            CatchHelper.assertError(new Error('is expected'));
        }

        expect(() => testException()).not.toThrowError();
    });

    it('should assert special error and rethrow if wrong with native error', function () {
        function testException() {
            try {
                (null as any).replace('a', 'b');
            } catch (e) {
                CatchHelper.assert(e, TestError);
            }
        }

        expect(() => testException()).toThrowError();
    });

    it('should assert special error and to nothing if right', function () {
        const testError: TestError = new TestError();

        function testException() {
            CatchHelper.assert(testError, TestError);
        }

        expect(() => testException()).not.toThrowError(testError);
    });

    it('should assert special error and rethrow if wrong', function () {
        const otherTestError: OtherTestError = new OtherTestError();

        function testException() {
            CatchHelper.assert(otherTestError, TestError);
        }

        expect(() => testException()).toThrowError(otherTestError);
    });
});
