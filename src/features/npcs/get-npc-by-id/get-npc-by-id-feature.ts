import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { Npc } from "../npc";
import { GetNpcByIdRequest } from "./get-npc-by-id-request";

export class GetNpcByIdFeature implements IFeature<GetNpcByIdRequest, Npc> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: GetNpcByIdRequest): Npc {
        return this.unitOfWork.repo(Npc).first((npc) => npc.id === request.id) ?? new Npc();
    }
}
