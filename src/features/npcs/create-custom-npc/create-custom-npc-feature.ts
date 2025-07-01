import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { ErrorCode } from "../../../lib/errors/error-code";
import { Result } from "../../../lib/result/result";
import { ResultError } from "../../../lib/result/result-error";
import { Npc } from "../npc";
import { CreateCustomNpcRequest } from "./create-custom-npc-request";

export class CreateCustomNpcFeature implements IFeature<CreateCustomNpcRequest, Result<Npc>> {
    private readonly unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: CreateCustomNpcRequest): Result<Npc> {
        const validationResults: string[] = request.npc.validate();
        let errorMsg: string = "";

        if (request.npc.name.trim() == "") {
            errorMsg = `The name \"${request.npc.name}\" is invalid. The name cannot be empty.`;
        } else if (request.npc.name.trim().length > 50) {
            errorMsg = `The name \"${request.npc.name}\" is invalid. The name must be 50 characters or less.`;
        }

        return Result.failure(new ResultError(ErrorCode.CreateError, errorMsg));
    }
}
