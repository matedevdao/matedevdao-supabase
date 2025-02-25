CREATE TABLE IF NOT EXISTS "public"."nft_holders" (
  "nft_address" "text" NOT NULL,
  "token_id" numeric NOT NULL,
  "holder" "text" NOT NULL,
  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
  "updated_at" timestamp with time zone
);

ALTER TABLE "public"."nft_holders" OWNER TO "postgres";

ALTER TABLE ONLY "public"."nft_holders"
  ADD CONSTRAINT "nft_holders_pkey" PRIMARY KEY ("nft_address", "token_id");

ALTER TABLE "public"."nft_holders" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."nft_holders" TO "anon";
GRANT ALL ON TABLE "public"."nft_holders" TO "authenticated";
GRANT ALL ON TABLE "public"."nft_holders" TO "service_role";

CREATE POLICY "Allow read access for all users" ON "public"."nft_holders" FOR SELECT USING (true);

CREATE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."nft_holders" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();
