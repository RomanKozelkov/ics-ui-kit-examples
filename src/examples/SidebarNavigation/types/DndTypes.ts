export type DropPosition = "before" | "after" | "child";

export type DropZone = {
  targetId: string;
  position: DropPosition;
} | null;
