export class GetGearByIdRequest {
    private readonly _id: number;
    private readonly _category: string;

    public get id(): number {
        return this._id;
    }

    public get category(): string {
        return this._category;
    }

    constructor(id: number, category: string) {
        this._id = id;
        this._category = category;
    }
}
