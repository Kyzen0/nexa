"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addGoal, updateGoal } from "@/app/actions/goals";
import { X, Loader2 } from "lucide-react";

type GoalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: {
    id: string;
    title: string;
    category: string;
    target: string;
    current: string;
    progress: number;
    status: string;
    deadline: string;
  };
};

const CATEGORIES = [
  "Growth & Sales",
  "Customer Retention",
  "Cost & Efficiency",
  "Product Expansion",
];

const STATUSES = ["On Track", "At Risk", "Achieved", "Exceeding Target"];

// Helper to strip non-numeric characters except decimals
const parseNumeric = (val: string) => {
  const stripped = val.replace(/[^0-9.-]+/g, "");
  return stripped ? parseFloat(stripped) : NaN;
};

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  const isEditing = !!goal;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [otherCategory, setOtherCategory] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState("On Track");
  const [deadline, setDeadline] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (goal) {
        setTitle(goal.title);
        setCategory(CATEGORIES.includes(goal.category) ? goal.category : "Other");
        setOtherCategory(CATEGORIES.includes(goal.category) ? "" : goal.category);
        setTargetValue(goal.target);
        setCurrentValue(goal.current);
        setProgress(goal.progress);
        setStatus(goal.status);
        setDeadline(goal.deadline);
      } else {
        setTitle("");
        setCategory(CATEGORIES[0]);
        setOtherCategory("");
        setTargetValue("");
        setCurrentValue("");
        setProgress(0);
        setStatus("On Track");
        setDeadline("");
      }
      setError(null);
    }
  }, [open, goal]);

  const isOtherCategory = category === "Other";
  
  // Auto-calculate progress if both are numbers
  useEffect(() => {
    const tNum = parseNumeric(targetValue);
    const cNum = parseNumeric(currentValue);

    if (!isNaN(tNum) && !isNaN(cNum) && tNum !== 0) {
      let calcProgress = (cNum / tNum) * 100;
      calcProgress = Math.max(0, Math.min(100, Math.round(calcProgress)));
      setProgress(calcProgress);
    }
  }, [targetValue, currentValue]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", isOtherCategory ? otherCategory : category);
      formData.append("target_value", targetValue);
      formData.append("current_value", currentValue);
      formData.append("progress_percentage", progress.toString());
      formData.append("status", status);
      formData.append("deadline", deadline);

      if (isEditing) {
        await updateGoal(goal.id, formData);
      } else {
        await addGoal(formData);
      }
      
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight">{isEditing ? "Edit Goal" : "Add Goal"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? "Update business goal details." : "Create a new business goal to track."}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              required
              placeholder="e.g. Increase Q3 Revenue by 15%"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other">Other...</option>
              </select>
            </div>
            
            {isOtherCategory ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Custom Category</label>
                <Input
                  required
                  placeholder="Category Name"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  className="h-10"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {isOtherCategory && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Current Value</label>
              <Input
                required
                placeholder="e.g. $1.2M or 35%"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Target Value</label>
              <Input
                required
                placeholder="e.g. $1.5M or 40%"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex justify-between">
                Progress (%)
                <span className="text-[10px] text-muted-foreground font-normal self-end mb-0.5">Auto</span>
              </label>
              <Input
                required
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="h-10 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Deadline</label>
              <Input
                required
                placeholder="e.g. End of Q3 or YYYY-MM-DD"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
