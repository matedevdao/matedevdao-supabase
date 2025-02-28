import {
  createPublicClient,
  getAddress,
  http,
  parseAbiItem,
} from "https://esm.sh/viem@2.23.5";
import { kaia } from "https://esm.sh/viem@2.23.5/chains";
import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import {
  safeFetchSingle,
  safeStore,
} from "https://raw.githubusercontent.com/yjgaia/supabase-module/refs/heads/main/deno/supabase.ts";
import SupportedNFTAddresses from "../_shared/SupportedNFTAddresses.ts";

const SAFE_BLOCK_RANGE = 2500n;

const TransferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

const kaiaPublicClient = createPublicClient({ chain: kaia, transport: http() });

serve(async () => {
  const data = await safeFetchSingle<{ id: number; last_parsed_block: number }>(
    "parsed_contract_event_blocks",
    (b) => b.select("id, last_parsed_block"),
  );
  if (!data) throw new Error("Last parsed block not found");

  let toBlock = BigInt(data.last_parsed_block) + SAFE_BLOCK_RANGE;

  const currentBlock = await kaiaPublicClient.getBlockNumber();
  if (toBlock > currentBlock) toBlock = currentBlock;

  let fromBlock = toBlock - SAFE_BLOCK_RANGE * 2n;
  if (fromBlock < 0) fromBlock = 0n;

  const logs = await kaiaPublicClient.getLogs({
    address: SupportedNFTAddresses,
    event: TransferEvent,
    fromBlock,
    toBlock,
  });

  const transfers = logs.map((log) => ({
    address: getAddress(log.address),
    from: log.args.from,
    to: log.args.to,
    tokenId: log.args.tokenId,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  }));

  for (const transfer of transfers) {
    await safeStore("nft_holders", (b) =>
      b.upsert({
        nft_address: transfer.address,
        token_id: Number(transfer.tokenId),
        holder: transfer.to,
      }));
  }

  await safeStore("parsed_contract_event_blocks", (b) =>
    b.update({
      last_parsed_block: Number(toBlock),
    }).eq("id", data.id));
});
