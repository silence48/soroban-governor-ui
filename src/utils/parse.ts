import { Proposal, Vote, XDRProposal, XDRVote } from "@/types";
import { ProposalAction } from "@script3/soroban-governor-sdk";
import { StrKey, scValToNative, xdr } from "@stellar/stellar-sdk";

export function parseProposalFromXDR(
  proposal: XDRProposal,
  voteDelay: number,
  votePeriod: number
): Proposal {
  let contract = xdr.Hash.fromXDR(proposal.contract, "base64");
  let governor = StrKey.encodeContract(contract);
  let scval = xdr.ScVal.fromXDR(proposal.action, "base64");
  let actionPropArray = scValToNative(scval);
  let action: ProposalAction;
  switch (actionPropArray[0]) {
    case "Snapshot": {
      action = { tag: actionPropArray[0], values: undefined };
      break;
    }
    case "Calldata":
    case "Upgrade":
    case "Settings":
    default: {
      action = { tag: actionPropArray[0], values: actionPropArray[1] };
      break;
    }
  }

  const proposalToReturn: Proposal = {
    governor,
    id: scValToNative(xdr.ScVal.fromXDR(proposal.propNum, "base64")),
    title: scValToNative(xdr.ScVal.fromXDR(proposal.title, "base64")),
    description: scValToNative(xdr.ScVal.fromXDR(proposal.descr, "base64")),
    action,
    proposer: scValToNative(xdr.ScVal.fromXDR(proposal.creator, "base64")),
    status: scValToNative(xdr.ScVal.fromXDR(proposal.status, "base64")),
    vote_start: scValToNative(xdr.ScVal.fromXDR(proposal.vStart, "base64")),
    vote_end: scValToNative(xdr.ScVal.fromXDR(proposal.vEnd, "base64")),
    executionETA:
      !!proposal.eta &&
      scValToNative(xdr.ScVal.fromXDR(proposal.eta, "base64")),
    link: "",
    votes_for: 0,
    votes_against: 0,
    votes_abstain: 0,
    total_votes: 0,
  };

  const voteCount =
    !!proposal.votes &&
    scValToNative(xdr.ScVal.fromXDR(proposal.votes, "base64"));
  if (!!voteCount) {
    proposalToReturn.votes_for = voteCount[0];
    proposalToReturn.votes_against = voteCount[1];
    proposalToReturn.votes_abstain = voteCount[2];
    proposalToReturn.total_votes = voteCount[3];
  }

  return proposalToReturn;
}

export function parseVoteFromXDR(vote: XDRVote): Vote {
  const voteToReturn = {
    voter: scValToNative(xdr.ScVal.fromXDR(vote.voter, "base64")),
    support: scValToNative(xdr.ScVal.fromXDR(vote.support, "base64")),
    amount: scValToNative(xdr.ScVal.fromXDR(vote.amount, "base64")),
    proposal_id: scValToNative(xdr.ScVal.fromXDR(vote.propNum, "base64")),
    governor: StrKey.encodeContract(xdr.Hash.fromXDR(vote.contract, "base64")),
    ledger: scValToNative(xdr.ScVal.fromXDR(vote.ledger, "base64")),
  };
  return voteToReturn;
}
