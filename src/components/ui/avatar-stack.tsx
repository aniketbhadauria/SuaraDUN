"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-1";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AvatarStackPerson = {
  name: string;
  src: string;
  initials: string;
};

type AvatarStackProps = {
  people: AvatarStackPerson[];
  className?: string;
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "size-8",
  md: "size-10",
};

export function AvatarStack({ people, className, size = "md" }: AvatarStackProps) {
  return (
    <div
      className={cn(
        "flex -space-x-2 *:data-[slot=tooltip-trigger]:ring-2 *:data-[slot=tooltip-trigger]:ring-background *:data-[slot=tooltip-trigger]:hover:z-10",
        className,
      )}
    >
      {people.map((person) => (
        <Tooltip key={person.name}>
          <TooltipTrigger asChild>
            <Avatar className={sizeClass[size]} data-slot="tooltip-trigger">
              <AvatarImage src={person.src} alt={person.name} />
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{person.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

/** Stock portraits (Unsplash) for demo / fallback rotation */
export const STOCK_AVATARS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
];

export const MB_AVATAR_SRC =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face";

export function initialsFromName(nama: string) {
  return nama
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
