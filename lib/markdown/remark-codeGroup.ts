import { visit } from "unist-util-visit";

export function remarkCodeGroup() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === "containerDirective" &&
        node.name === "code-group"
      ) {
        const children = node.children || [];

        node.data = {
          hName: "CodeGroup",
        };

        children.forEach((child: any) => {
          if (child.type === "code") {
            child.data = {
              hProperties: {
                language: child.lang || "text",
              },
            };
          }
        });
      }
    });
  };
}