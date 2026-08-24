import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-neutral-800 selection:text-neutral-100">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" />
            Back to Nexa
          </Link>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm font-mono">Effective Date: August 24, 2026</p>
          </div>
          
          <div className="space-y-8 text-[15px] text-foreground/90 leading-relaxed">
            <p>
              Welcome to Nexa. This Privacy Policy explains how your information is collected, used, and protected when you use Nexa (the &quot;Service&quot;).
            </p>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">1. About Nexa</h2>
              <p>
                Nexa is a personal portfolio and educational project developed and operated by an individual developer (&quot;Zyne&quot;), not a registered company or legal entity.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 marker:text-muted-foreground">
                <li><strong>Account Information</strong>: When you create an account, we collect your email address, business/workspace name, and a password. Passwords are securely hashed and never stored in plain text.</li>
                <li><strong>Google OAuth</strong>: If you choose to sign in using Google, we receive your name, email address, and profile picture from Google.</li>
                <li><strong>User-Generated Data</strong>: You may manually input business data, including customer records, product records, order records, business goals, and reports.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">3. How We Use Your Information</h2>
              <p>
                Your data is used exclusively to provide and improve the Service. We do not sell your data, display advertisements, or use third-party advertising trackers.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">4. Third-Party Service Providers</h2>
              <p>To operate the Service, we utilize the following third-party infrastructure:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-muted-foreground">
                <li><strong>Supabase</strong>: Handles our database and user authentication.</li>
                <li><strong>Vercel</strong>: Hosts the application.</li>
                <li><strong>Resend</strong>: Delivers transactional emails (e.g., password resets).</li>
                <li><strong>Google Gemini API</strong>: Powers the &quot;Ask Nexa AI&quot; feature. When you use this feature, a snapshot of relevant business data is sent to Gemini to generate insights. This is the only instance where your data leaves our primary database to interact with an external AI provider.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">5. Cookies</h2>
              <p>
                We use only essential session/auth cookies required to maintain your logged-in state. We do not use tracking or advertising cookies.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">6. Your Data Rights</h2>
              <p>
                You maintain full control over your data. You can <Link href="/dashboard/settings" className="font-semibold text-foreground underline decoration-border hover:decoration-emerald-500 transition-colors">permanently delete your account and all associated data</Link> at any time from the Settings page.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">7. Contact</h2>
              <p>
                If you have any questions, you can contact me at <a href="mailto:hello@zyne.dev" className="font-semibold text-foreground underline decoration-border hover:decoration-emerald-500 transition-colors">hello@zyne.dev</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
