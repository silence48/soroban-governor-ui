import { Container } from "@/components/common/BaseContainer";
import { Box } from "@/components/common/Box";
import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Chip";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import Typography from "@/components/common/Typography";
import {
  useDelegate,
  useGovernor,
  useUnderlyingTokenBalance,
  useVoteTokenBalance,
  useVotingPower,
} from "@/hooks/api";
import { useWallet } from "@/hooks/wallet";
import DAOLayout from "@/layouts/dao";
import { scaleNumberToBigInt, toBalance } from "@/utils/formatNumber";
import { shortenAddress } from "@/utils/shortenAddress";
import { getTokenExplorerUrl } from "@/utils/token";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import governors from "../../../public/governors/governors.json";
import { GetStaticPaths, GetStaticProps } from "next";

function ManageVotes() {
  const [toWrap, setToWrap] = useState<string>("");
  const [toUnwrap, setToUnwrap] = useState<string>("");
  const [newDelegate, setNewDelegate] = useState<string>("");
  const {
    wrapToken,
    unwrapToken,
    connect,
    connected,
    isLoading,
    walletAddress,
    delegate,
  } = useWallet();
  const router = useRouter();
  const params = router.query;
  const { governor } = useGovernor(params.dao as string, {
    placeholderData: {},
  });
  const { delegateAddress, refetch: refetchDelegate } = useDelegate(
    governor?.voteTokenAddress,
    {
      enabled: connected && !!governor?.voteTokenAddress,
    }
  );
  const hasDelegate = connected && delegateAddress !== walletAddress;
  const { balance, refetch: refetchBalance } = useVoteTokenBalance(
    governor?.voteTokenAddress,
    {
      placeholderData: BigInt(0),
      enabled: connected && !!governor?.voteTokenAddress,
    }
  );

  const { votingPower, refetch: refetchVotingPower } = useVotingPower(
    governor?.voteTokenAddress,
    {
      placeholderData: BigInt(0),
      enabled: connected && !!governor?.voteTokenAddress,
    }
  );

  const { balance: underlyingTokenBalance, refetch: refetchunderlying } =
    useUnderlyingTokenBalance(governor?.underlyingTokenAddress || "", {
      enabled: connected && !!governor?.underlyingTokenAddress,
      placeholderData: BigInt(0),
    });

  function handleWrapClick() {
    if (!connected) {
      connect();
      return;
    } else {
      const amount = scaleNumberToBigInt(toWrap, governor?.decimals);
      wrapToken(governor?.voteTokenAddress, amount, false).then((res) => {
        refetchBalance();
        refetchunderlying();
        refetchVotingPower();
        setToUnwrap("");
        setToWrap("");
      });
    }
  }

  function handleUnwrapClick() {
    if (!connected) {
      connect();
      return;
    } else {
      const amount = scaleNumberToBigInt(toUnwrap, governor?.decimals);
      unwrapToken(governor?.voteTokenAddress, amount, false).then((res) => {
        refetchunderlying();
        refetchBalance();
        refetchVotingPower();
        setToUnwrap("");
        setToWrap("");
      });
    }
  }

  function handleDelegateClick() {
    if (!connected) {
      connect();
      return;
    } else {
      delegate(governor?.voteTokenAddress, newDelegate, false).then(() => {
        setNewDelegate("");
        refetchDelegate();
        refetchVotingPower();
      });
    }
  }

  function handleRemoveDelegateClick() {
    if (!connected) {
      connect();
      return;
    } else {
      delegate(governor?.voteTokenAddress, walletAddress, false).then(() => {
        setNewDelegate("");
        refetchDelegate();
        refetchVotingPower();
      });
    }
  }

  return (
    <Container slim className="flex flex-col gap-4">
      <Container className="gap-2 flex flex-col ">
        <Typography.P
          onClick={() => {
            router.back();
          }}
          className="text-snapLink  hover:underline cursor-pointer  flex w-max "
        >
          <Image
            src="/icons/back-arrow.svg"
            alt="back"
            width={24}
            height={24}
          />{" "}
          Back
        </Typography.P>
        <Typography.Huge>Your Votes</Typography.Huge>
        {!!governor.isWrappedAsset && (
          <Container>
            <Typography.P>
              This space uses a bonded token for voting. You can get bonded
              tokens by bonding the corresponding Stellar asset. A bonded token
              can be returned back to a Stellar asset at any time.
            </Typography.P>
            <Container slim className="py-2 gap-1 flex flex-col">
              <Typography.P>
                Stellar asset:{" "}
                <Typography.P
                  onClick={() => {
                    window.open(
                      getTokenExplorerUrl(
                        governor.underlyingTokenMetadata?.issuer || "",
                        governor?.underlyingTokenMetadata?.symbol || ""
                      ),
                      "_blank"
                    );
                  }}
                  className="text-snapLink cursor-pointer hover:underline"
                >
                  {governor?.underlyingTokenMetadata?.symbol}
                </Typography.P>
              </Typography.P>

              <Typography.P>
                Bonded token contract:{" "}
                <Typography.P
                  onClick={() => {
                    window.open(
                      `${process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL}/contract/${governor.voteTokenAddress}`,
                      "_blank"
                    );
                  }}
                  className="text-snapLink cursor-pointer hover:underline"
                >
                  {governor?.voteTokenAddress}
                </Typography.P>
              </Typography.P>
            </Container>
          </Container>
        )}

        {!governor.isWrappedAsset && (
          <Container slim className="py-2 gap-1 flex flex-col">
            <Typography.P>
              Contract address:{" "}
              <Typography.P
                onClick={() => {
                  window.open(
                    `${process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL}/contract/${governor.voteTokenAddress}`,
                    "_blank"
                  );
                }}
                className="text-snapLink cursor-pointer hover:underline"
              >
                {governor?.voteTokenAddress}
              </Typography.P>
            </Typography.P>
          </Container>
        )}
        <Box className="p-3 flex gap-3 flex-col !px-0">
          <Container className="flex flex-col p-3 gap-2 border-b border-snapBorder w-full">
            <Typography.Tiny className="text-snapLink">
              Current Voting power
            </Typography.Tiny>
            <Container slim className="flex gap-2">
              <Typography.P>
                {toBalance(votingPower, governor?.decimals || 7)} votes
              </Typography.P>
              {hasDelegate && (
                <Chip className="!bg-transparent border border-secondary text-secondary">
                  Delegated
                </Chip>
              )}
            </Container>
          </Container>
          <Container className="flex flex-col p-3 gap-2  w-full">
            <Typography.Tiny className="text-snapLink">
              Current Voting tokens balance
            </Typography.Tiny>
            <Container slim className="flex gap-2">
              <Typography.P>
                {toBalance(balance, governor?.decimals || 7)}{" "}
                {governor?.voteTokenMetadata?.symbol}
              </Typography.P>
              {hasDelegate && (
                <Chip className="!bg-transparent border border-secondary text-secondary">
                  Delegated
                </Chip>
              )}
            </Container>
          </Container>
        </Box>
        <Box className="pt-3 flex gap-3 flex-col !px-0">
          {governor.isWrappedAsset && (
            <>
              <Container className="flex flex-col justify-center p-2 ">
                <Typography.P>
                  Bond {governor?.underlyingTokenMetadata?.symbol} to get{" "}
                  {governor?.voteTokenMetadata.symbol}
                </Typography.P>
                {connected && (
                  <Typography.Small className="text-snapLink">
                    Wallet balance:{" "}
                    {toBalance(underlyingTokenBalance, governor?.decimals || 7)}{" "}
                    {governor?.underlyingTokenMetadata?.symbol}
                    {/* {governor?.name || "$VOTE"} */}
                  </Typography.Small>
                )}
              </Container>
              <Container slim className="w-full flex flex-col  gap-3 px-4 ">
                <Input
                  className="!w-full flex"
                  placeholder="Amount to bond"
                  onChange={setToWrap}
                  value={toWrap}
                  type="number"
                />
              </Container>
              <Button
                className="!w-full rounded-b-xl rounded-t-none flex !bg-white text-snapBorder active:opacity-50 "
                onClick={handleWrapClick}
                disabled={isLoading || (connected && !toWrap)}
              >
                {isLoading ? <Loader /> : connected ? "Bond" : "Connect wallet"}
              </Button>
            </>
          )}
        </Box>
        {balance > BigInt(0) && governor?.isWrappedAsset && (
          <Box className="pt-3 !px-0 flex gap-3 flex-col ">
            <Container className="flex flex-col justify-center p-2 ">
              <Typography.P>
                Unbond {governor?.voteTokenMetadata.symbol} to get{" "}
                {governor?.underlyingTokenMetadata?.symbol}
              </Typography.P>
              {connected && (
                <Typography.Small className="text-snapLink">
                  Voting token balance:{" "}
                  {toBalance(balance, governor?.decimals || 7)}{" "}
                  {governor?.voteTokenMetadata.symbol}
                </Typography.Small>
              )}
            </Container>
            <Container slim className="w-full flex flex-col  gap-3 px-4">
              <Input
                className="!w-full flex"
                placeholder="Amount to unbond"
                onChange={setToUnwrap}
                value={toUnwrap}
                type="number"
              />
            </Container>
            <Button
              className="!w-full rounded-b-xl rounded-t-none flex !bg-white text-snapBorder active:opacity-50 "
              onClick={handleUnwrapClick}
              disabled={isLoading || (connected && !toUnwrap)}
            >
              {isLoading ? <Loader /> : connected ? "Unbond" : "Connect wallet"}
            </Button>
          </Box>
        )}
        {connected && <Typography.Big>Delegate</Typography.Big>}
        {connected && !hasDelegate && (
          <Box className="!p-0 flex gap-3 flex-col ">
            <Container className="flex flex-col justify-center p-3 pb-0 ">
              <Typography.Small className="text-snapLink">To</Typography.Small>
            </Container>
            <Container className="w-full flex flex-col gap-3">
              <Input
                className=" flex"
                placeholder="Address"
                onChange={setNewDelegate}
                value={newDelegate}
              />
            </Container>
            <Button
              className="!w-full rounded-b-xl rounded-t-none flex !bg-secondary text-snapBorder active:opacity-50 "
              onClick={handleDelegateClick}
              disabled={
                isLoading ||
                (connected && !newDelegate) ||
                (connected && newDelegate.toString().length < 56)
              }
            >
              {isLoading ? (
                <Loader />
              ) : connected ? (
                "Delegate"
              ) : (
                "Connect wallet"
              )}
            </Button>
          </Box>
        )}
        {connected && !!hasDelegate && (
          <Box className="!p-0 flex gap-3 flex-col ">
            <Container className="flex flex-col justify-center p-4 border-b border-snapBorder">
              <Typography.Small>Your delegate</Typography.Small>
            </Container>
            <Container className="w-full flex flex-row justify-between gap-3">
              <Typography.P>{shortenAddress(delegateAddress)}</Typography.P>
              <Typography.P>
                {toBalance(balance, governor?.voteTokenMetadata?.decimals || 7)}{" "}
                {"delegated votes"}
              </Typography.P>
            </Container>
            <Button
              className="!w-full rounded-b-xl rounded-t-none flex !bg-[#49222b] text-red-500 border-red-700 active:opacity-50 "
              onClick={handleRemoveDelegateClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader />
              ) : connected ? (
                "Rescind delegation"
              ) : (
                "Connect wallet"
              )}
            </Button>
          </Box>
        )}
      </Container>
    </Container>
  );
}

ManageVotes.getLayout = (page: any) => <DAOLayout>{page}</DAOLayout>;

export default ManageVotes;

export const getStaticProps = ((context) => {
  return { props: { dao: context.params?.dao?.toString() || "" } };
}) satisfies GetStaticProps<{
  dao: string;
}>;
export const getStaticPaths = (async () => {
  return {
    paths: governors.map((governor) => {
      return {
        params: {
          dao: governor.address,
        },
      };
    }),
    fallback: false, // false or "blocking"
  };
}) satisfies GetStaticPaths;
