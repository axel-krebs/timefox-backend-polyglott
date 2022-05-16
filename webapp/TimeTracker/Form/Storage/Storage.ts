import Client, {EditIndex, IndexNotStored} from '../Client';
import Encoder from './Encoder';
import Parser from './Parser';

export interface StorageContainer {
    editIndex: EditIndex | undefined;
    text: string;
    issue: string;
    minute: number;
    hour: number;
    isChanged: boolean;
}

export default class StorageClient implements Client {
    private static storageKey: string = 'TimeTracker::Form::Client';

    constructor(
        private storage: Storage,
        private encoder: Encoder,
        private parser: Parser
    ) {
    }

    public async isChanged(): Promise<boolean> {
        return this.loadContainer().isChanged;
    }

    public async setChanged(isChanged: boolean): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.isChanged = isChanged;
        this.saveContainer(container);
    }

    public async getHour(): Promise<number> {
        return this.loadContainer().hour;
    }

    public async saveHour(hour: number): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.hour = hour;
        this.saveContainer(container);
    }

    public async getMinute(): Promise<number> {
        return this.loadContainer().minute;
    }

    public async saveMinute(minute: number): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.minute = minute;
        this.saveContainer(container);
    }

    public async getIssue(): Promise<string> {
        return this.loadContainer().issue;
    }

    public async saveIssue(code: string): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.issue = code;
        this.saveContainer(container);
    }

    public async getText(): Promise<string> {
        return this.loadContainer().text;
    }

    public async saveText(text: string): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.text = text;
        this.saveContainer(container);
    }

    public async getEditIndex(): Promise<throwsErrorOrReturn<IndexNotStored, EditIndex>> {
        const editIndex: EditIndex | undefined = this.loadContainer().editIndex;
        if (editIndex === undefined) throw new IndexNotStored();
        return editIndex;
    }

    public async saveEditIndex(index: EditIndex): Promise<void> {
        const container: StorageContainer = this.loadContainer();
        container.editIndex = index;
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
