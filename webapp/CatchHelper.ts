export default class CatchHelper {
    public static assertError(error: any): void {
        if (error.constructor !== Error) throw error;
    }

    public static assert(error: any, className: any): void {
        if ((error instanceof className) === false) throw error;
    }
}
