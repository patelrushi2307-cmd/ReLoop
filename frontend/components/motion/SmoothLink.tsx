"use client";

import Link from "next/link";
import { useCallback, type MouseEvent, type ReactNode } from "react";
import { useScrollApi } from "@/components/motion/LenisProvider";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * Lenis rewrites the scroll position every frame, so a native hash jump is
 * undone before it lands. In-page links have to go through its scrollTo
 * instead; anything pointing at a route stays ordinary Next navigation.
 */
export function SmoothLink({ href, className, children, onClick, ...rest }: Props) {
  const { scrollTo } = useScrollApi();

  const jump = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onClick?.();
      /* The menu unlocks Lenis in an effect; scroll once that has run. */
      requestAnimationFrame(() => {
        if (!document.querySelector(href)) return;
        scrollTo(href);
        window.history.replaceState(null, "", href);
      });
    },
    [href, onClick, scrollTo],
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={jump} className={className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}

/** The doubled-label hover roll used by the nav and the utility bar. */
export function RollLink({
  label,
  href,
  className = "",
  onClick,
}: {
  label: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <SmoothLink href={href} onClick={onClick} className={`roll ${className}`}>
      <span>{label}</span>
      <span aria-hidden>{label}</span>
    </SmoothLink>
  );
}
