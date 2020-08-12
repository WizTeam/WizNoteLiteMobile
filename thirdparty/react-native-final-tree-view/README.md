# react-native-final-tree-view

A React Native Tree View component!

## Installation

`yarn add react-native-final-tree-view`

## Usage

Firstly, you have to define your data. Example:

```js
const family = [
  {
    id: 'Grandparent',
    name: 'Grandpa',
    age: 78,
    children: [
      {
        id: 'Me',
        name: 'Me',
        age: 30,
        children: [
          {
            id: 'Erick',
            name: 'Erick',
            age: 10,
          },
          {
            id: 'Rose',
            name: 'Rose',
            age: 12,
          },
        ],
      },
    ],
  },
]
```

It is required that each node on the tree have its own `id` key. Obviously, it should be **unique**.
The tree nodes are defined in the `children` key.
They are an array of objects, following the same structure as the parent.

After defining your data, mount the component. Example:

```js
import React from 'react'
import { Text, View } from 'react-native'

import TreeView from 'react-native-final-tree-view'

function getIndicator(isExpanded, hasChildrenNodes) {
  if (!hasChildrenNodes) {
    return '-'
  } else if (isExpanded) {
    return '\\/'
  } else {
    return '>'
  }
}

function App() {
  return (
    <TreeView
      data={family} // defined above
      renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
        return (
          <View>
            <Text
              style={{
                marginLeft: 25 * level,
              }}
            >
              {getIndicator(isExpanded, hasChildrenNodes)} {node.name}
            </Text>
          </View>
        )
      }}
    />
  )
}

export default App
```

This should display:

![First render](https://i.imgur.com/LWDr9Ba.png)

And, after a few touches:

![All expanded](https://i.imgur.com/lEWGnIW.png)

## Props

### `data`

**Required**. The tree data to render. It's an array of objects.
Each object should have, at least, the `id` of the node and the `children` of it.
This structure can be changed via the props `idKey` and `childrenKey`, respectively.

### `renderNode`

**Required**. A function that must return the JSX to render the item. Signature:

```js
renderNode({ node, level, isExpanded, hasChildrenNodes })
```

Example:

```js
function getIndicator(isExpanded, hasChildrenNodes) {
  if (!hasChildrenNodes) {
    return '-'
  } else if (isExpanded) {
    return '\\/'
  } else {
    return '>'
  }
}

renderNode={({ node, level, isExpanded, hasChildrenNodes }) => (
  <View>
    <Text
      style={{
        marginLeft: 25 * level,
      }}
    >
      {getIndicator(isExpanded, hasChildrenNodes)} {node.name}
    </Text>
  </View>
)}
```

### `onNodePress`

Optional. A callback fired when a node is pressed. Signature:

```js
onNodePress({ node, level })
```

It accepts a promise if you want. If you **DON'T** want the specific node to expand or collapse, return `false` at the end of this event!!!

### `onNodeLongPress`

Optional. A callback fired when a node is long pressed. Signature:

```js
onNodeLongPress({ node, level })
```

### `isNodeExpanded`

Optional. Used for custom handling of expanded nodes. Signature:

```js
isNodeExpanded(id)
```

### `getCollapsedNodeHeight`

Optional. The collapsed item height for level. Defaults to `20`. Signature:

```js
getCollapsedNodeHeight({ [idKey], level })
```

The `[idKey]` part is whatever you chose to be the id. Defaults to `id`

### `idKey`

Optional. The `id` key to refer to. Defaults to `id`

### `childrenKey`

Optional. The `children` key to look for. Defaults to `children`

### `initialExpanded`

If nodes should start expanded. Defaults to `false`

## FAQ

### If I modify the `data` prop does it reflect the changes without collapsing the nodes?

No. Once you modify the data, the whole tree goes back to `initialExpanded`

### Are PRs open?

Yes! Feel free to contribute!

## License

MIT
