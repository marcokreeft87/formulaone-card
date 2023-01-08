export default class LocalStorageMock {
    store: { [key: string]: string };

    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key: string): string {
        return this.store[key];
    }

    setItem(key: string, value: string) {
        this.store[key] = value;
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}
