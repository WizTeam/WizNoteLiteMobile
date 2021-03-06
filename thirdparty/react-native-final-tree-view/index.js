/* eslint-disable semi */
import {get} from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ListItem } from 'react-native-elements';

class TreeView extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderExpandButton: PropTypes.func.isRequired,
    initialExpanded: PropTypes.bool,
    getCollapsedNodeHeight: PropTypes.func,
    idKey: PropTypes.string,
    childrenKey: PropTypes.string,
    onNodePress: PropTypes.func,
    onNodeLongPress: PropTypes.func,
    isNodeExpanded: PropTypes.func,
    shouldDisableTouchOnLeaf: PropTypes.func,
    selectedContainerStyle: PropTypes.object,
    selectedItemTitleStyle: PropTypes.object,
  }

  static defaultProps = {
    initialExpanded: false,
    getCollapsedNodeHeight: () => 20,
    idKey: 'id',
    childrenKey: 'children',
    onNodePress: null,
    onNodeLongPress: null,
    isNodeExpanded: null,
    shouldDisableTouchOnLeaf: () => false,
    selectedContainerStyle: {},
    selectedItemTitleStyle: {},
  }

  constructor(props) {
    super(props)

    this.state = this.getInitialState()
  }

  getInitialState = () => {
    const expandedNodeKeys = {};
    //
    if (this.props.expandedNodeKeys) {
      this.props.expandedNodeKeys.forEach((id) => {
        expandedNodeKeys[id] = true;
      });
    }
    //
    return { expandedNodeKeys };
  };

  componentDidUpdate(prevProps) {
    const hasDataUpdated = prevProps.data !== this.props.data
    const hasIdKeyUpdated = prevProps.idKey !== this.props.idKey
    const childrenKeyUpdated = prevProps.childrenKey !== this.props.childrenKey

    if (hasDataUpdated || hasIdKeyUpdated || childrenKeyUpdated) {
      this.setState(this.getInitialState())
    }
  }

  hasChildrenNodes = (node) =>
    get(node, `${this.props.childrenKey}.length`, 0) > 0

  isExpanded = (id) => {
    if (this.props.isNodeExpanded !== null) {
      return this.props.isNodeExpanded(id)
    } else {
      return get(this.state.expandedNodeKeys, id, this.props.initialExpanded)
    }
  }

  updateNodeKeyById = (id, expanded) => ({ expandedNodeKeys }) => ({
    expandedNodeKeys: Object.assign({}, expandedNodeKeys, {
      [id]: expanded,
    }),
  })

  collapseNode = (id) => this.setState(this.updateNodeKeyById(id, false))

  expandNode = (id) => this.setState(this.updateNodeKeyById(id, true))

  toggleCollapse = (id) => {
    const method = this.isExpanded(id) ? 'collapseNode' : 'expandNode'
    this[method](id)
  }

  handleNodePressed = async ({ node, level }) => {
    if (this.props.onNodePress) {
      await this.props.onNodePress({ node, level })
    }
  }

  handleButtonPressed = async ({ node }) => {
    if (this.props.onBeforeExpandNode) {
      const isExpanded = this.isExpanded(node.id);
      const ret = await this.props.onBeforeExpandNode({ node, isExpanded });
      if (!ret) return
    }
    if (this.hasChildrenNodes(node)) {
      this.toggleCollapse(node[this.props.idKey])
    }
  }

  Node = ({ nodes, level }) => {
    const NodeComponent = this.Node
    if (!nodes) {
      return <></>;
    }

    return nodes.map((node) => {
      const isExpanded = this.isExpanded(node[this.props.idKey])
      const hasChildrenNodes = this.hasChildrenNodes(node)
      const shouldRenderLevel = hasChildrenNodes && isExpanded

      return (
        <View
          key={node[this.props.idKey]}
          style={{
            height: isExpanded
              ? 'auto'
              : this.props.getCollapsedNodeHeight({
                [this.props.idKey]: node[this.props.idKey],
                level,
              }),
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <ListItem
            pad={0}
            containerStyle={[
              {
                ...this.props.itemContainerStyle,
                paddingLeft: 22 * level,
                paddingRight: 8,
              },
              this.props.selected === node.id && this.props.selectedContainerStyle,
            ]}
            onPress={() => this.handleNodePressed({ node, level })}
            underlayColor={this.props.underlayColor}
          >
            <View style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <TouchableOpacity
                onPress={() => this.handleButtonPressed({ node, level })}
              >
                {React.createElement(this.props.renderExpandButton, {
                  node,
                  level,
                  isExpanded,
                  hasChildrenNodes,
                  isSelected: this.props.selected === node.id,
                })}
              </TouchableOpacity>
            </View>
            <ListItem.Content style={this.props.itemContentContainerStyle}>
              <ListItem.Title style={[
                this.props.itemTitleStyle,
                this.props.selected === node.id && this.props.selectedItemTitleStyle,
              ]}
              >
                {node.name}
              </ListItem.Title>
            </ListItem.Content>
            {
              this.props.selected === node.id
              && this.props.renderSelectedMarker
              && (
                <View style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >
                  {this.props.renderSelectedMarker(node)}
                </View>
              )
            }
          </ListItem>
          {shouldRenderLevel && (
            <NodeComponent
              nodes={node[this.props.childrenKey]}
              level={level + 1}
            />
          )}
        </View>
      )
    })
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <this.Node
          style={this.props.style}
          nodes={this.props.data}
          level={0}
        />
      </View>
    );
  }
}

export default TreeView
