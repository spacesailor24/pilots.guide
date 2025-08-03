"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface LinkWithTransitionProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LinkWithTransition({
  href,
  children,
  className,
  onClick,
}: LinkWithTransitionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={{
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 150ms",
      }}
    >
      {children}
    </Link>
  );
}