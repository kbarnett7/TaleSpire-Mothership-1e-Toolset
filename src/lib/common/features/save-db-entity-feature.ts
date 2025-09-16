import { ErrorCode } from "../../errors/error-code";
import { LocalizationService } from "../../localization/localization-service";
import { MessageKeys } from "../../localization/message-keys";
import { Result } from "../../result/result";
import { ResultError } from "../../result/result-error";
import { IUnitOfWork } from "../data-access/unit-of-work-interface";

export abstract class SaveDbEntityFeature {
    protected readonly unitOfWork: IUnitOfWork;
    protected baseFailureMessage: string;
    protected errorCode: string;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
        this.baseFailureMessage = LocalizationService.instance.translate(MessageKeys.saveCustomGearItemFailed);
        this.errorCode = ErrorCode.UnexpectedError;
    }

    protected createExceptionResult<T>(ex: Error): Result<T> {
        return Result.failure(new ResultError(this.errorCode, this.baseFailureMessage, [ex.message]));
    }

    protected setErrorResultFields(id: number, createMessageKey: string, editMessageKey: string) {
        if (id === 0) {
            this.errorCode = ErrorCode.CreateError;
            this.baseFailureMessage = LocalizationService.instance.translate(createMessageKey);
        } else {
            this.errorCode = ErrorCode.EditError;
            this.baseFailureMessage = LocalizationService.instance.translate(editMessageKey);
        }
    }
}
