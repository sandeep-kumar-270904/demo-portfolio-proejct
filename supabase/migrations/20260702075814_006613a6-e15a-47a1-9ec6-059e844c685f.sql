-- Restrict Realtime channel subscriptions on contact_messages to admins only.
-- Enable RLS on realtime.messages (safe to run repeatedly).
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can subscribe to contact_messages realtime" ON realtime.messages;

CREATE POLICY "Admins can subscribe to contact_messages realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  extension = 'postgres_changes'
  AND (
    (topic = 'contact_messages' OR topic LIKE 'realtime:public:contact_messages%')
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  )
  OR topic NOT LIKE '%contact_messages%'
);
