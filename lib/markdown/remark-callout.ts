import { visit } from 'unist-util-visit'

export function remarkCallout() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'callout') {
        return
      }

      const type = node.attributes?.type ?? 'info'

      node.type = 'mdxJsxFlowElement'

      node.name = 'Callout'

      node.attributes = [
        {
          type: 'mdxJsxAttribute',
          name: 'type',
          value: type,
        },
      ]
    })
  }
}