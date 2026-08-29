import { visit } from 'unist-util-visit'

export function remarkYoutube() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'youtube') {
        return
      }

      const videoId = node.attributes?.videoId ?? null

      node.type = 'mdxJsxFlowElement'

      node.name = 'Youtube'

      node.attributes = [
        {
          type: 'mdxJsxAttribute',
          name: 'videoId',
          value: videoId,
        },
      ]
    })
  }
}