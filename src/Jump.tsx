import type { MouseEvent, ReactNode } from "react";
import { completeLocation, formatHash, go, type Location } from "./nav";

export function Jump({
  to,
  className = "",
  title,
  children,
}: {
  to: Partial<Location>;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={formatHash(completeLocation(to))}
      className={className}
      title={title}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        event.stopPropagation();
        go(to);
      }}
    >
      {children}
    </a>
  );
}
