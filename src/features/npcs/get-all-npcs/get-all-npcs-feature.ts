import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { EmptyRequest } from "../../../lib/common/features/empty-request";
import { IFeature } from "../../../lib/common/features/feature-interface";
import { Npc } from "../npc";
import { NpcListItem } from "../npc-list-item";
import { NpcListItemMap } from "../npc-list-item-map";

export class GetAllNpcsFeature implements IFeature<EmptyRequest, NpcListItem[]> {
    private unitOfWork: IUnitOfWork;

    constructor(unitOfWork: IUnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    public handle(request: EmptyRequest): NpcListItem[] {
        return this.unitOfWork.repo(Npc).list().map(NpcListItemMap.fromNpc);
    }
}
