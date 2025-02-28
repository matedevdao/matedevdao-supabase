# matedevdao-supabase

## Deploy Edge Function

```
supabase secrets set --env-file ./supabase/.env

supabase functions deploy ping
supabase functions deploy fetch-all-nft-holders
supabase functions deploy parse-contract-events
```

## Postgres Cron 정보 보기

```sql
select * from cron.job; -- 스케줄 목록
select * from cron.job_run_details; -- 스케줄 실행 이력

SELECT cron.unschedule(1); -- 스케줄 취소
```
