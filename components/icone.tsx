import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export type { IconSvgElement };

/** Ícones Hugeicons. Decorativos por omissão; passa aria-label quando transmitem informação. */
export function Icone({
  icon,
  size = 20,
  strokeWidth = 1.8,
  className,
  "aria-label": ariaLabel,
}: {
  icon: IconSvgElement;
  size?: number;
  strokeWidth?: number;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? "img" : undefined}
    />
  );
}
