import { createPublicClient, http } from "https://esm.sh/viem@2.21.47";
import { kaia } from "https://esm.sh/viem@2.21.47/chains";
import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { safeStore } from "https://raw.githubusercontent.com/yjgaia/supabase-module/refs/heads/main/deno/supabase.ts";
import ParsingNFTDataArtifact from "./artifacts/ParsingNFTData.json" with {
  type: "json",
};

const PARSING_NFT_DATA_CONTRACT_ADDRESS =
  "0x8A98A038dcA75091225EE0a1A11fC20Aa23832A0";

const kaiaPublicClient = createPublicClient({ chain: kaia, transport: http() });

const tokenIdsRanges: { [address: string]: { from: number; to: number } } = {
  "0xE47E90C58F8336A2f24Bcd9bCB530e2e02E1E8ae": { from: 0, to: 9999 }, // DogeSoundClub Mates
  "0x2B303fd0082E4B51e5A6C602F45545204bbbB4DC": { from: 0, to: 7999 }, // DogeSoundClub E-Mates
  "0xDeDd727ab86bce5D416F9163B2448860BbDE86d4": { from: 0, to: 19999 }, // DogeSoundClub Biased Mates
  "0x7340a44AbD05280591377345d21792Cdc916A388": { from: 0, to: 8000 }, // Sigor Sparrows
  "0x455Ee7dD1fc5722A7882aD6B7B8c075655B8005B": { from: 0, to: 8000 }, // Sigor House Deeds
  "0xF967431fb8F5B4767567854dE5448D2EdC21a482": { from: 0, to: 2999 }, // KCD Kongz
  "0x81b5C41Bac33ea696D9684D9aFdB6cd9f6Ee5CFF": { from: 1, to: 10000 }, // KCD Pixel Kongz
  "0x595b299Db9d83279d20aC37A85D36489987d7660": { from: 0, to: 2999 }, // BabyPing
};

serve(async (req) => {
  const { address } = await req.json();
  if (!address) throw new Error("Invalid request");

  const range = tokenIdsRanges[address];
  if (!range) throw new Error("Token ID range for provided address not found");

  const { from, to } = range;
  let holderList: string[] = [];

  for (let start = from; start <= to; start += 500) {
    const end = Math.min(start + 499, to);
    const tokenIds: bigint[] = [];
    for (let i = start; i <= end; i++) {
      tokenIds.push(BigInt(i));
    }

    const batchHolderList = await kaiaPublicClient.readContract({
      address: PARSING_NFT_DATA_CONTRACT_ADDRESS,
      abi: ParsingNFTDataArtifact.abi,
      functionName: "getERC721HolderList",
      args: [address, tokenIds],
    }) as string[];

    holderList = holderList.concat(batchHolderList);

    await safeStore("nft_holders", (b) =>
      b.upsert([
        ...batchHolderList.map((holder, index) => ({
          nft_address: address,
          token_id: start + index,
          holder,
        })),
      ]));
  }
});
