# matedevdao-supabase

## Deploy Edge Function

```
supabase secrets set --env-file ./supabase/.env

supabase functions deploy ping
supabase functions deploy fetch-all-nft-holders
supabase functions deploy parse-contract-events
```
