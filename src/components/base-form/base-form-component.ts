import { BaseDto } from "../../lib/dto/base-dto";
import { BaseComponent } from "../base.component";

export abstract class BaseFormComponent extends BaseComponent {
    static formAssociated = true;

    private _internals: ElementInternals;
    protected _formFieldsDto: BaseDto;

    public get value(): string {
        return this._formFieldsDto.toJson();
    }

    public getFormFieldsDto<TDto extends BaseDto>(): TDto {
        return this._formFieldsDto as TDto;
    }

    constructor(dto: BaseDto) {
        super();
        this._internals = this.attachInternals();
        this._formFieldsDto = dto;
    }

    protected updateFormValue() {
        this._internals.setFormValue(this.value);
    }

    public abstract setInitialFormValues(dto: BaseDto): void;
}
