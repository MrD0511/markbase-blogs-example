import { visit } from 'unist-util-visit'

export function remarkFaq() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'faq') {
        return
      }

      const question = node.attributes?.question ?? 'Enter your question here'

      node.type = 'mdxJsxFlowElement'

      node.name = 'Faq'

      node.attributes = [
        {
          type: 'mdxJsxAttribute',
          name: 'question', 
          value: question,
        }
      ]
    })
  }
}