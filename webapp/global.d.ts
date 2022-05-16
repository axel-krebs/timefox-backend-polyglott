type throwsErrorOrReturn<E extends Error, T> = T;
type throwsError<E extends Error> = void;
