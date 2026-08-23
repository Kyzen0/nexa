"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle2, AlertCircle, Loader2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkspaceName } from "@/app/actions/workspace";

export function ProfileForm({ 
  initialWorkspaceName, 
  initialEmail 
}: { 
  initialWorkspaceName: string;
  initialEmail: string;
}) {
  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName);
  const [email, setEmail] = useState(initialEmail);
  
  // State for workspace name update
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // State for email update
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleUpdateName = async () => {
    if (!workspaceName.trim()) {
      setNameError("Company name cannot be empty");
      return;
    }
    
    setIsUpdatingName(true);
    setNameError(null);
    setNameSuccess(false);
    
    try {
      await updateWorkspaceName(workspaceName.trim());
      setNameSuccess(true);
      setIsEditingName(false);
      router.refresh(); // Ensure layout sidebar reflects the new name
      
      // Hide success message after 3 seconds
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error: any) {
      setNameError(error.message || "Failed to update company name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsUpdatingEmail(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      setEmailSuccess(true);
      setIsEditingEmail(false);
    } catch (error: any) {
      setEmailError(error.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const hasNameChanged = workspaceName !== initialWorkspaceName;
  const hasEmailChanged = email !== initialEmail;
  const workspaceSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div className="space-y-6">
      {/* Company Name Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Company Name
          </label>
          {!isEditingName && (
            <Button 
              variant="ghost" 
              size="xs" 
              className="h-6 gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setIsEditingName(true);
                setNameSuccess(false);
              }}
            >
              <Edit2 className="size-3" />
              <span>Edit</span>
            </Button>
          )}
        </div>
        
        {isEditingName ? (
          <div className="flex gap-2">
            <Input 
              value={workspaceName} 
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setNameError(null);
                setNameSuccess(false);
              }} 
              disabled={isUpdatingName}
              autoFocus
            />
            <Button 
              size="sm" 
              className="shrink-0 gap-1.5" 
              disabled={!hasNameChanged || isUpdatingName || !workspaceName.trim()}
              onClick={handleUpdateName}
            >
              {isUpdatingName ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              <span>Save</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="shrink-0 px-2" 
              disabled={isUpdatingName}
              onClick={() => {
                setIsEditingName(false);
                setWorkspaceName(initialWorkspaceName);
                setNameError(null);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="p-2.5 text-sm rounded-md border border-border/50 bg-muted/20 text-foreground font-medium">
            {initialWorkspaceName}
          </div>
        )}
        
        {nameError && (
          <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="size-3" /> {nameError}
          </p>
        )}
        {nameSuccess && (
          <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1">
            <CheckCircle2 className="size-3" /> Company name updated successfully
          </p>
        )}
      </div>

      {/* Workspace Slug Field */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">
          Workspace Slug
        </label>
        <Input value={workspaceSlug} className="font-mono bg-muted/40" disabled />
        <p className="text-[11px] text-muted-foreground">
          Automatically generated from your company name. Used for internal routing.
        </p>
      </div>

      <div className="h-px bg-border/60 my-2" />

      {/* Email Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Admin Email
          </label>
          {!isEditingEmail && (
            <Button 
              variant="ghost" 
              size="xs" 
              className="h-6 gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setIsEditingEmail(true);
                setEmailSuccess(false);
              }}
            >
              <Edit2 className="size-3" />
              <span>Edit</span>
            </Button>
          )}
        </div>
        
        {isEditingEmail ? (
          <div className="flex gap-2">
            <Input 
              type="email"
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
                setEmailSuccess(false);
              }} 
              disabled={isUpdatingEmail}
              autoFocus
            />
            <Button 
              size="sm" 
              className="shrink-0 gap-1.5" 
              disabled={!hasEmailChanged || isUpdatingEmail}
              onClick={handleUpdateEmail}
            >
              {isUpdatingEmail ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              <span>Save</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="shrink-0 px-2" 
              disabled={isUpdatingEmail}
              onClick={() => {
                setIsEditingEmail(false);
                setEmail(initialEmail);
                setEmailError(null);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="p-2.5 text-sm rounded-md border border-border/50 bg-muted/20 text-foreground font-medium">
            {initialEmail}
          </div>
        )}
        
        {emailError && (
          <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="size-3" /> {emailError}
          </p>
        )}
        {emailSuccess && (
          <div className="text-[11px] text-emerald-500 flex items-start gap-1.5 mt-2 bg-emerald-500/10 p-2.5 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" /> 
            <p>
              Confirmation links have been sent to both your <strong>current</strong> and <strong>new</strong> email addresses. 
              You must click both links for the change to take effect.
            </p>
          </div>
        )}
      </div>

      {/* Currency Field */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">
          Base Currency
        </label>
        <Input defaultValue="USD ($)" disabled className="bg-muted/40" />
      </div>
    </div>
  );
}
