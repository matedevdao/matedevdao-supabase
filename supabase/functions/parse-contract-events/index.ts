import { parseAbiItem } from "https://esm.sh/v135/viem@2.21.47/_types/index.d.ts";
import { createPublicClient, http } from "https://esm.sh/viem@2.21.47";
import { kaia } from "https://esm.sh/viem@2.21.47/chains";
import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import SupportedNFTAddresses from "../_shared/SupportedNFTAddresses.ts";

const TransferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

const kaiaPublicClient = createPublicClient({ chain: kaia, transport: http() });

serve(async (req) => {
  const { address } = await req.json();
  if (!address) throw new Error("Invalid request");

  if (!SupportedNFTAddresses.includes(address)) {
    throw new Error("NFT address not supported");
  }

  const logs = await kaiaPublicClient.getLogs({
    address,
    event: TransferEvent,
    fromBlock,
    toBlock,
  });
});
