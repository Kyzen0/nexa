"use client";

import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const internalRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const handleClear = () => {
      if (props.onChange) {
        props.onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      }
      internalRef.current?.focus();
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-[4.5rem]", className)}
          ref={internalRef}
          {...props}
        />
        <div className="absolute right-0 top-0 h-full flex items-center pr-1.5 gap-0.5">
          {props.value ? (
            <button
              type="button"
              className="p-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear password"
            >
              <X className="size-4" />
            </button>
          ) : null}
          <button
            type="button"
            className="p-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
