import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
  const { data: d1 } = await supabase.from('orders').select('id, customers(name)').limit(3);
  console.log('Without customer_id:', JSON.stringify(d1, null, 2));

  const { data: d2 } = await supabase.from('orders').select('id, customer_id, customers(name)').limit(3);
  console.log('With customer_id:', JSON.stringify(d2, null, 2));
}

run();
