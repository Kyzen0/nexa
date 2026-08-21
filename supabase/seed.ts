import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load env variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const customers = [
  { name: "Solstice Retail Co.", contact_email: "alice@solsticeretail.com", tier: "Wholesale", status: "Active", joined_at: "2025-01-01" },
  { name: "Lumina Retail", contact_email: "orders@luminaretail.com", tier: "Retail Partner", status: "Active", joined_at: "2025-03-01" },
  { name: "Nova Roasters", contact_email: "hello@novaroasters.io", tier: "Wholesale", status: "Active", joined_at: "2024-11-01" },
  { name: "Atlas Supply", contact_email: "purchasing@atlassupply.ai", tier: "B2B Standard", status: "At Risk", joined_at: "2026-08-01" },
  { name: "Meridian Co.", contact_email: "billing@meridian.se", tier: "Wholesale", status: "Active", joined_at: "2025-05-01" },
];

const ordersSeed = [
  { customerName: "Solstice Retail Co.", channel: "Shopify (Online)", amount: 145.20, status: "Fulfilled" },
  { customerName: "Lumina Retail", channel: "POS (Retail)", amount: 42.50, status: "Processing" },
  { customerName: "Nova Roasters", channel: "Shopify (Online)", amount: 820.00, status: "Fulfilled" },
  { customerName: "Atlas Supply", channel: "Amazon Marketplace", amount: 32.10, status: "Pending" },
  { customerName: "Meridian Co.", channel: "Shopify (Online)", amount: 210.00, status: "Fulfilled" },
];

const products = [
  { name: "Artisan Coffee Blend", category: "Consumables", description: "Signature medium roast coffee beans sourced from Colombia.", status: "Low Stock", monthly_sales_volume: 1420, margin_percentage: 42.0 },
  { name: "Ceramic Pour-Over Dripper", category: "Equipment", description: "Hand-crafted ceramic dripper for manual coffee brewing.", status: "In Stock", monthly_sales_volume: 450, margin_percentage: 58.0 },
  { name: "Double-Walled Glass Mug", category: "Drinkware", description: "Insulated glass mug that keeps beverages hot without burning hands.", status: "Backordered", monthly_sales_volume: 820, margin_percentage: 65.0 },
  { name: "Electric Gooseneck Kettle", category: "Electronics", description: "Precision temperature control kettle for optimal extraction.", status: "In Stock", monthly_sales_volume: 125, margin_percentage: 35.0 },
];

const sales_channels = [
  { name: "Shopify (Online Store)", monthly_orders: 12450, gross_revenue: 1200000, net_margin_percentage: 42.0, growth_mom_percentage: 14.0 },
  { name: "Amazon Marketplace", monthly_orders: 8120, gross_revenue: 840000, net_margin_percentage: 28.0, growth_mom_percentage: 8.0 },
  { name: "Retail POS (Flagship)", monthly_orders: 3400, gross_revenue: 320000, net_margin_percentage: 51.0, growth_mom_percentage: -2.0 },
  { name: "Instagram Shop", monthly_orders: 2150, gross_revenue: 145000, net_margin_percentage: 38.0, growth_mom_percentage: 22.0 },
  { name: "Wholesale (B2B)", monthly_orders: 180, gross_revenue: 1600000, net_margin_percentage: 22.0, growth_mom_percentage: 5.0 },
];

const goals = [
  { title: "Increase Q3 Revenue by 15%", category: "Growth & Sales", target_value: "$1.5M", current_value: "$1.24M", progress_percentage: 82, status: "On Track", deadline: "End of Q3 2026" },
  { title: "Reduce Customer Churn under 2%", category: "Customer Retention", target_value: "2.0%", current_value: "2.4%", progress_percentage: 80, status: "At Risk", deadline: "End of Year" },
  { title: "Improve Gross Margin to 35%", category: "Cost & Efficiency", target_value: "35.0%", current_value: "32.8%", progress_percentage: 94, status: "On Track", deadline: "Sep 2026" },
  { title: "Launch 3 New Product Lines", category: "Product Expansion", target_value: "3 Lines", current_value: "3 Lines", progress_percentage: 100, status: "Achieved", deadline: "Quarterly" },
];

const ai_insights = [
  { name: "Revenue Anomaly Detector", model: "Nexa Core", task_description: "Monitoring daily sales against historical seasonal trends", status: "Running", tokens_used: 248500, latency_ms: 185 },
  { name: "Inventory Optimizer", model: "Nexa Fast", task_description: "Generated reorder list based on projected weekend demand", status: "Completed", tokens_used: 82100, latency_ms: 112 },
  { name: "Customer Churn Predictor", model: "Nexa Reasoning", task_description: "Identifying high-value customers with declining purchase frequency", status: "Running", tokens_used: 512400, latency_ms: 320 },
  { name: "Marketing ROI Analyzer", model: "Nexa Lite", task_description: "Attributing offline sales to recent email campaigns", status: "Standby", tokens_used: 12900, latency_ms: 94 },
];

const notifications = [
  { title: "Inventory Alert: Artisan Coffee Blend is running low", description: "Based on current sales velocity, you will run out of stock in approximately 4 days.", type: "warning", badge_text: "Reorder", is_read: false },
  { title: "Goal Progress: Revenue Target at 85%", description: "You are on track to hit your Q3 revenue goal of $1.5M. Keep it up!", type: "success", badge_text: "Milestone", is_read: false },
  { title: "New Customer: Meridian Co. placed their first order", description: "Meridian Co. just placed a wholesale order for $4,200.", type: "info", badge_text: "Sales", is_read: false },
  { title: "Daily Report: Sales up 12% yesterday", description: "Your daily sales report is ready. Revenue increased by 12% compared to the previous Tuesday.", type: "info", badge_text: "Report", is_read: true },
];

const reports = [
  { title: "Q2 2026 Financial Summary", period: "Q2 2026", file_size_bytes: 4200000, format: "PDF", status: "Finalized" },
  { title: "Monthly Sales by Channel", period: "July 2026", file_size_bytes: 1800000, format: "CSV", status: "Verified" },
  { title: "Inventory Valuation & Costs", period: "July 2026", file_size_bytes: 890000, format: "PDF", status: "Draft" },
  { title: "Annual Revenue Growth Analysis", period: "Annual 2025", file_size_bytes: 12400000, format: "PDF", status: "Finalized" },
];

async function seed() {
  console.log('Seeding Database...');

  // 0. Clean up tables
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sales_channels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ai_insights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Cleared existing data.');

  // Customers
  const { data: insertedCustomers, error: custErr } = await supabase.from('customers').insert(customers).select();
  if (custErr) {
    console.error('Error inserting customers:', custErr);
    return;
  }
  console.log(`Inserted ${insertedCustomers.length} customers.`);

  // Orders
  const orders = ordersSeed.map(o => {
    const cust = insertedCustomers.find((c: any) => c.name === o.customerName);
    return {
      customer_id: cust ? cust.id : null,
      channel: o.channel,
      amount: o.amount,
      status: o.status
    };
  });
  
  const { error: ordErr } = await supabase.from('orders').insert(orders);
  if (ordErr) console.error('Error inserting orders:', ordErr);
  else console.log(`Inserted ${orders.length} orders.`);

  // Independent Tables
  const { error: prodErr } = await supabase.from('products').insert(products);
  if (prodErr) console.error('Error inserting products:', prodErr);
  else console.log(`Inserted ${products.length} products.`);

  const { error: scErr } = await supabase.from('sales_channels').insert(sales_channels);
  if (scErr) console.error('Error inserting sales_channels:', scErr);
  else console.log(`Inserted ${sales_channels.length} sales channels.`);

  const { error: gErr } = await supabase.from('goals').insert(goals);
  if (gErr) console.error('Error inserting goals:', gErr);
  else console.log(`Inserted ${goals.length} goals.`);

  const { error: aiErr } = await supabase.from('ai_insights').insert(ai_insights);
  if (aiErr) console.error('Error inserting ai_insights:', aiErr);
  else console.log(`Inserted ${ai_insights.length} ai_insights.`);

  const { error: nErr } = await supabase.from('notifications').insert(notifications);
  if (nErr) console.error('Error inserting notifications:', nErr);
  else console.log(`Inserted ${notifications.length} notifications.`);

  const { error: rErr } = await supabase.from('reports').insert(reports);
  if (rErr) console.error('Error inserting reports:', rErr);
  else console.log(`Inserted ${reports.length} reports.`);

  console.log('Seeding complete!');
}

seed();
