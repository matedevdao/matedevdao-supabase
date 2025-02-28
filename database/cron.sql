SELECT cron.schedule(
  'ping_pong_daily', -- 작업 이름 (매일 실행)
  '0 0 * * *', -- Cron 표현식: 매일 자정 실행 (24시간마다)
  $$
  -- Edge Function 호출
  select net.http_post(
      'https://auvrvnwprlcilrqjphdu.supabase.co/functions/v1/ping',
      body := '{}'::JSONB,
      headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dnJ2bndwcmxjaWxycWpwaGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTkxODQsImV4cCI6MjA1NjAzNTE4NH0.1YK0DJXbxbA_9oCQC8sneaDnq7K9FKBtBe6-jtcAYT0"}'::JSONB
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'parse_contract_events_every_minute', -- 작업 이름 (매 분 실행)
  '*/1 * * * *', -- Cron 표현식: 매 분
  $$
  -- Edge Function 호출
  select net.http_post(
      'https://auvrvnwprlcilrqjphdu.supabase.co/functions/v1/parse_contract_events',
      body := '{}'::JSONB,
      headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dnJ2bndwcmxjaWxycWpwaGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTkxODQsImV4cCI6MjA1NjAzNTE4NH0.1YK0DJXbxbA_9oCQC8sneaDnq7K9FKBtBe6-jtcAYT0"}'::JSONB
  ) AS request_id;
  $$
);
