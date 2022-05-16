export interface ReportSetup {
    selectedMonth: Date;
}

export class SetupNotStored extends Error {
}

export default interface Client {
    getSelectedMonth(): Promise<throwsErrorOrReturn<SetupNotStored, Date>>;

    saveSelectedMont(month: Date): Promise<void>;
}
