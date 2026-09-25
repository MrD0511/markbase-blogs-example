import { visit } from 'unist-util-visit'

export function remarkAccordion() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'accordion') {
        return
      }

      const label = node.attributes?.label ?? 'an untitled label'

      node.type = 'mdxJsxFlowElement'

      node.name = 'Accordion'

      node.attributes = [
        {
          type: 'mdxJsxAttribute',
          name: 'label', 
          value: label,
        }
      ]
    })
  }
}