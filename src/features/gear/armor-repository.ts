import { ArmorItem } from "./armor-item";
import data from "../../database/armor.data.json";

export class ArmorRepository {
    constructor() {}

    public list(): ArmorItem[] {
        return data;
    }
}
