CREATE TABLE IF NOT EXISTS "public"."parsed_contract_event_blocks" (
  "id" smallint NOT NULL,
  "last_parsed_block" bigint NOT NULL,
  "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."parsed_contract_event_blocks" OWNER TO "postgres";
ALTER TABLE "public"."parsed_contract_event_blocks" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
  SEQUENCE NAME "public"."parsed_contract_event_blocks_id_seq"
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1
);

ALTER TABLE ONLY "public"."parsed_contract_event_blocks"
  ADD CONSTRAINT "parsed_contract_event_blocks_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."parsed_contract_event_blocks" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."parsed_contract_event_blocks" TO "anon";
GRANT ALL ON TABLE "public"."parsed_contract_event_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."parsed_contract_event_blocks" TO "service_role";

CREATE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."parsed_contract_event_blocks" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();
