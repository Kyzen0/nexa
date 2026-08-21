import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg";
}

function Avatar({
  className,
  src,
  alt = "User Avatar",
  fallback = "NX",
  size = "default",
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: "size-7 text-[11px]",
    default: "size-8 text-xs",
    lg: "size-10 text-sm font-medium",
  };

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted font-medium text-muted-foreground select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <span className="font-mono uppercase">{fallback}</span>
      )}
    </div>
  );
}

export { Avatar };
