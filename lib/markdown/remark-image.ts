// lib/markdown/remark-image.ts
import { visit } from "unist-util-visit";

export function remarkImage() {
  return (tree: any) => {
    visit(tree, "paragraph", (node: any, index: number | undefined, parent: any) => {
      if (!node.children || node.children.length !== 1) return;

      const child = node.children[0];

      if (child.type !== "image") return;

      if (index === undefined || !parent) return;

      parent.children[index] = child;
    });
  };
}