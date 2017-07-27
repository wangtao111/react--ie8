/**
 * Created by Administrator on 2017/4/18.
 */
import React from 'react';
import 'antd/lib/index.css';
import Tree from 'antd/lib/tree';
import Component from '../../../../constants/Component';
const TreeNode = Tree.TreeNode;
class CaseTree extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      defaultSearchTags: [],
      expandedKeys: [],
      visible: false,
      predictPropertyForm: {},
      caseCauseMsgForm: {},
      main_punish_option: {
        prisonTerm: { zh_name: '有期徒刑', value: '', UnitName: '个月' },
        isLife: { zh_name: '无期徒刑', value: '', UnitName: '' },
        deathPenalty: { zh_name: '死刑', value: '', UnitName: '' },
        detentionTerm: { zh_name: '拘役', value: '', UnitName: '天' },
        control: { zh_name: '管制', value: '', UnitName: '天' }
      },
      main_punish_id: '',
      checkedKeys: this.props.selectTags,
      searchTags: []
    };
  }
  render() {
    const { treeData, checkedKeys, handleCheck, expandedKeys, handleSelect } = this.props;
    const loop = data => data.map((item) => {
      if (item.sub_tags) {
        return <TreeNode title={item.zh_name} key={item.id}>{loop(item.sub_tags)}</TreeNode>;
      }
      return <TreeNode title={item.zh_name} key={item.id} />;
    });
    const parseTreeNode = data => loop(data);
    const treeNodes = parseTreeNode(treeData);
    return (<div>
      <Tree
        checkable
        defaultExpandedKeys={expandedKeys}
        onCheck={handleCheck.bind(this)}
        checkedKeys={checkedKeys}
        selectedKeys={checkedKeys}
        onSelect={handleSelect}
      >
        {treeNodes}
      </Tree>
    </div>);
  }
}
CaseTree.propTypes = {
  treeData: React.PropTypes.array.isRequired,
  checkedKeys: React.PropTypes.array.isRequired,
  expandedKeys: React.PropTypes.array.isRequired,
  handleCheck: React.PropTypes.func.isRequired
};
export default CaseTree;
