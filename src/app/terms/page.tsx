import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-3">Terms of Service</h1>
            <p className="text-muted-foreground text-sm font-mono">Effective Date: August 24, 2026</p>
          </div>
          
          <div className="space-y-8 text-[15px] text-foreground/90 leading-relaxed">
            <p>
              By using Nexa, you agree to these Terms of Service. Please read them carefully.
            </p>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">1. Nature of the Service</h2>
              <p>
                Nexa is a personal, educational portfolio project operated by an individual developer (&quot;Zyne&quot;), not a formal corporate entity. The Service is provided free of charge for demonstration and personal use.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">2. &quot;As Is&quot; Disclaimer and Limitation of Liability</h2>
              <p>
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties, express or implied. To the fullest extent permitted by law, the developer (&quot;Zyne&quot;) disclaims all liability for any data loss, business interruption, or damages arising from your use of the Service. <strong>Do not use Nexa as the sole system of record for critical business operations.</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">3. Acceptable Use</h2>
              <p>
                You agree not to misuse the Service or help anyone else do so. You are strictly prohibited from attempting to breach the security of the application, reverse-engineer its components, or use the Service for any illegal activities.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">4. Account Termination</h2>
              <ul className="list-disc pl-5 space-y-2 marker:text-muted-foreground">
                <li><strong>By You</strong>: You may <Link href="/dashboard/settings" className="font-semibold text-foreground underline decoration-border hover:decoration-emerald-500 transition-colors">delete your account and all associated data</Link> at any time via the Settings page.</li>
                <li><strong>By Us</strong>: We reserve the right to suspend or terminate your account at any time, for any reason, without notice. Because this is a personal project, the Service may be modified, suspended, or discontinued entirely at any point.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">5. Contact</h2>
              <p>
                For any questions regarding these Terms, contact <a href="mailto:hello@zyne.dev" className="font-semibold text-foreground underline decoration-border hover:decoration-emerald-500 transition-colors">hello@zyne.dev</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
