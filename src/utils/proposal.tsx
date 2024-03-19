import { ProposalStatusEnum } from "@/constants";

export function getStatusByProposalState(statusFromContract:ProposalStatusEnum,voteStart:number,voteEnd:number,currentBlock:number){
    if(!statusFromContract){
        return statusFromContract
    }
    const statusOpen = statusFromContract === ProposalStatusEnum.Active || statusFromContract === ProposalStatusEnum.Pending as any;

    if(statusOpen){
        if(voteStart<currentBlock && voteEnd>currentBlock){
            return ProposalStatusEnum.Active
        }
        if(voteEnd < currentBlock){
            return ProposalStatusEnum.CLOSED
        }
        if(voteStart > currentBlock){
            return ProposalStatusEnum.Pending
        }
        return ProposalStatusEnum.OPEN
    }
    return statusFromContract
}