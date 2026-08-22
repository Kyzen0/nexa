import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_key_here') {
      return NextResponse.json({ error: 'Gemini API key is missing or invalid in .env.local.' }, { status: 500 });
    }

    const supabase = await createClient();
    
    // Check for authentication to prevent unauthorized API calls
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch snapshot of business data using server-side Supabase client
    const [ordersRes, productsRes, customersRes, goalsRes, channelsRes] = await Promise.all([
      supabase.from('orders').select('channel, amount, status, created_at').order('created_at', { ascending: false }).limit(20),
      supabase.from('products').select('name, category, status, monthly_sales_volume, margin_percentage'),
      supabase.from('customers').select('name, contact_email, tier, status, joined_at'),
      supabase.from('goals').select('title, category, target_value, current_value, progress_percentage, status'),
      supabase.from('sales_channels').select('name, monthly_orders, gross_revenue, net_margin_percentage, growth_mom_percentage')
    ]);

    const contextData = {
      recent_orders: ordersRes.data || [],
      products: productsRes.data || [],
      customers: customersRes.data || [],
      goals: goalsRes.data || [],
      sales_channels: channelsRes.data || []
    };

    const systemPrompt = `
      You are Nexa AI, a highly intelligent and concise business assistant for an SMB Business Intelligence platform. 
      You are answering a question from the user about their business.
      
      Here is the current real-time snapshot of the business database:
      ${JSON.stringify(contextData, null, 2)}
      
      Instructions:
      1. Answer the user's question concisely and specifically.
      2. Always cite real numbers and data points from the provided database snapshot to back up your answer.
      3. Do NOT make up any numbers or trends.
      4. If the provided data snapshot does not contain enough information to accurately answer the question, state that clearly and concisely (e.g. "I do not have enough data to answer that.")
      5. Format your response in plain text or simple markdown. Do not use overly complex formatting or pleasantries.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `System Context: ${systemPrompt}\n\nUser Question: ${question}` }] }]
    });

    return NextResponse.json({ response: result.response.text() });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request. ' + (error.message || '') }, { status: 500 });
  }
}
