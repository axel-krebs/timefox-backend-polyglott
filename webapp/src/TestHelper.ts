import JestMatchers = jest.JestMatchers;

export async function expectAsync<T>(fn: Promise<T>): Promise<JestMatchers<T>> {
    const promise: Promise<() => T | void> = fn
        .then(
            (result: T) => (): T => result
        )
        .catch(
            (error: Error) => (): void => {
                throw error;
            }
        );
    return expect(await promise);
}

export function createErrorImplementation<T, Y>(error?: Error): (...args: Y[]) => T {
    return function (): void {
        if (error !== undefined) throw error;
        throw new Error('[Simulated Error]');
    } as any;
}
