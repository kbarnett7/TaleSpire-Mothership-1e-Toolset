export class AppEvent {
    private _type: string;

    public get type(): string {
        return this._type;
    }

    constructor(type: string) {
        this._type = type;
    }
}
