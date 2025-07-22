export class EquipmentItemFormFields {
    private _name: string;
    private _description: string;
    private _cost: string;

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get description(): string {
        return this._description;
    }

    public set description(name: string) {
        this._description = name;
    }

    public get cost(): string {
        return this._cost;
    }

    public set cost(name: string) {
        this._cost = name;
    }

    constructor(name?: string, description?: string, cost?: string) {
        this._name = name ?? "";
        this._description = description ?? "";
        this._cost = cost ?? "0";
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    static createFromJson(jsonStr: string): EquipmentItemFormFields {
        const json = JSON.parse(jsonStr);

        return new EquipmentItemFormFields(json.name ?? "", json.description ?? "", json.cost ?? "0");
    }
}
