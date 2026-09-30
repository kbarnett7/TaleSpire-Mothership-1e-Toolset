export class BaseDto {
    public toJson(): string {
        return JSON.stringify(this);
    }
}
