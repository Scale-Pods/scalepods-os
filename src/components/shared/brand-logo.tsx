import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The ScalePods logo. Both files are black on a transparent background, so in
 * dark mode they are inverted to white.
 *   wordmark: the full "ScalePods" lettering (aspect ~6:1)
 *   mark:     just the dotted "o" (square), for tight spaces
 */
export function BrandLogo({
  variant = "wordmark",
  height = 24,
  className,
  priority,
}: {
  variant?: "wordmark" | "mark";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const isMark = variant === "mark";
  const width = isMark ? height : Math.round(height * (1200 / 199));
  return (
    <Image
      src={isMark ? "/logo-mark.png" : "/logo-wordmark.png"}
      alt="ScalePods"
      width={width}
      height={height}
      priority={priority}
      className={cn("shrink-0 dark:invert", className)}
      style={{ height, width: "auto" }}
    />
  );
}
