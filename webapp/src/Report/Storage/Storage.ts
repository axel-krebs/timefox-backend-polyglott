import Client, {SetupNotStored} from '../Client';
import Encoder from './Encoder';
import Parser from './Parser';

export interface StorageContainer {
    selectedMonth: Date;
}

export default class StorageClient implements Client {
    private static storageKey: string = 'Report::Client';

    constructor(
        private storage: Storage,
        private encoder: Encoder,
        private parser: Parser
    ) {
    }

    public async getSelectedMonth(): Promise<throwsErrorOrReturn<SetupNotStored, Date>> {
        const selectedMonth: Date = this.loadContainer().selectedMonth;
        if (selectedMonth === undefined) throw new SetupNotStored();
        return selectedMonth;
    }

    public async saveSelectedMont(month: Date): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.selectedMonth = month;
        this.saveContainer(container);
    }

    private loadContainer(): StorageContainer {
        const json: string | null = this.storage.getItem(StorageClient.storageKey);
        return this.parser.parse(json);
    }

    private saveContainer(container: StorageContainer): void {
        this.storage.setItem(StorageClient.storageKey, this.encoder.encode(container));
    }
}
