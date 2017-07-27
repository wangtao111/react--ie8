import React from 'react';
import 'antd/lib/index.css';
import Modal from 'antd/lib/modal';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Component from '../../../../constants/Component';
import '../../../../less/case_warning/dialog.less';
import Notifications, { notify } from '../../../commons/notify';
import CaseTree from './case_tree';

const Option = Select.Option;
class CaseDialog extends Component {
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
      main_punish_value: '',
      main_punish_id: '',
      checkedKeys: this.props.selectTags,
      searchTags: []
    };
  }
  componentWillMount = () => {
    // 获取展开元素
    const preExpandedKeys = this.getExpandedKeys(this.props.selectTags);
    this.setState({
      expandedKeys: preExpandedKeys
    });
    let predictPropertyForm = {};
    for ( var key of Object.keys( this.props.predictProperty ) ) {
      predictPropertyForm[key] = this.props.predictProperty[key];
    }
    let caseCauseMsgForm = {};
    for ( var key of Object.keys( this.props.caseCauseMsg ) ) {
      caseCauseMsgForm[key] = [];
      for ( let i = 0; i < this.props.caseCauseMsg[key].length; i++ ) {
        let n = {};
        for ( var towKey of Object.keys( this.props.caseCauseMsg[key][i] ) ) {
          n[towKey] = this.props.caseCauseMsg[key][i][towKey]
        }
        console.log(0,n)
        caseCauseMsgForm[key].push(n);
      }
    }
    console.log('asdasd0',caseCauseMsgForm);
    let id = 'prisonTerm';
    if (predictPropertyForm.prisonTerm) {
      id = 'prisonTerm';
    }
    if (predictPropertyForm.detentionTerm) {
      id = 'detentionTerm';
    }
    if (predictPropertyForm.control) {
      id = 'control';
    }
    if (predictPropertyForm.isLife) {
      id = 'isLife';
    }
    if (predictPropertyForm.deathPenalty) {
      id = 'deathPenalty';
    }
    const obj = this.state.main_punish_option[id];
    obj.value = predictPropertyForm[id] || 0;
    Object.assign(this.state.main_punish_option, { [id]: obj });
    this.setState({
      main_punish_id: id,
      main_punish_option: this.state.main_punish_option,
      predictPropertyForm: predictPropertyForm,
      main_punish_value: this.state.main_punish_option[id].value,
      caseCauseMsgForm
    });
    const tags = [];
    for (const item of this.props.tags) {
      tags.push(item.name);
    }
    this.setState({
      checkedKeys: tags
    });
    this.handleTagChange(tags);
    if (this.props.caseCauseId) {
      this.$api.decision.searchTags.request({ case_cause_id: this.props.caseCauseId }).then((response) => {
        this.setState({ searchTags: response.data.data });
      });
    }
  }
  componentDidMount = () => {

  }
  getExpandedKeys = (selectTags) => {
    let expandedKeys = [];
    for (const item of selectTags) {
      const result = this.getParent(item, this.props.treeData).result;
      expandedKeys = expandedKeys.concat(result);
    }
    return expandedKeys;
  }
  /*
   * 在标签树中选择标签
   */
  getParent = (id, tree, parents = []) => {
    let result = parents;
    let flag = false;
    for (let i = 0; i < tree.length; i += 1) {
      result.push(tree[i].id);
      if (tree[i].id === id) {
        flag = true;
        break;
      } else if (tree[i].sub_tags) {
        const result1 = this.getParent(id, tree[i].sub_tags, result);
        flag = result1.flag;
        if (!result1.flag) {
          result = result1.result;
        }
      }
      if (!flag) {
        result.pop();
      } else {
        break;
      }
    }
    return {
      result,
      flag
    };
  }
  handleCheck = (info) => {
    const newcheckedKeys = this.state.checkedKeys;
    if (info.node.props.children) {
      console.log(info.node.props);
      // info.node.props.expanded = !info.node.props.expanded;
      // notify.show('请不要选择父元素！');
    }else{
      if (newcheckedKeys.indexOf(info.node.props.eventKey) === -1) {
        newcheckedKeys.push(info.node.props.eventKey);
      } else {
        const index = newcheckedKeys.indexOf(info.node.props.eventKey);
        newcheckedKeys.splice(index, 1);
      }
      this.setState({
        checkedKeys: newcheckedKeys
      });
    }
  }
  handleSelect = (info) => {
    console.log(info);
    info.node.handleExpand();
  };
  /*
   * 对应的input框发生改变
   */
  punishInputChange = (name, e) => {
    const change = {};
    if(e){
      change[name] = e.target ? e.target.value : e;
      if (name === 'confiscateProperty') {
        change[name] = e.target ? e.target.checked : e;
      }
      this.setState({
        predictPropertyForm: Object.assign(this.state.predictPropertyForm, change)
      });
      console.log(this.state.predictPropertyForm);
    }
  }
  /*
   * 切换主刑选项的时候清空其他主刑参数数据
   */
  clearOtherPunish = (id) => {
    const mainPunishOption = this.state.main_punish_option;
    const predictPropertyForm = this.state.predictPropertyForm;
    for (const key of Object.keys(mainPunishOption)) {
      if (key !== id && key !== 'isLife' && key !== 'deathPenalty') {
        predictPropertyForm[key] = 0;
      }
      predictPropertyForm[id] = mainPunishOption[id].value;
    }
    this.setState({
      predictPropertyForm
    });
  }
  /*
   * 选择死刑或无期徒刑的弹出框
   */
  mainPunishChange = (id) => {
    this.setState({
      main_punish_id: id,
      main_punish_value: this.state.main_punish_option[id].value
    });
    if (id === 'isLife' || id === 'deathPenalty') {
      notify.show('无法预测无期徒刑和死刑判刑');
    } else {
      const mainPunishObj = Object.assign(this.state.predictPropertyForm, {
        [id]: this.state.predictPropertyForm[id] || 0
      });
      this.setState({
        predictPropertyForm: mainPunishObj
      });
      this.clearOtherPunish(id);
    }
  }
  /*
   * 选择主刑表单时下方的输入参数同步更新到状态
   */
  prePunishInputChange = (name, value) => {
    const obj = {};
    obj[name] = value;
    const mainPunishObj = Object.assign(this.state.predictPropertyForm, obj);
    mainPunishObj.mainPunish = this.state.main_punish_option[name];
    mainPunishObj.mainPunish.id = name;
    mainPunishObj.mainPunish.value = value;
    this.setState({
      main_punish_value: value,
      predictPropertyForm: mainPunishObj
    });
    console.log('啊啊啊啊',mainPunishObj,this.state.predictPropertyForm);
  }
  // 查找标签中文名
  searchChName = (id, List) => {
    let label = '';
    for (const item of List) {
      if (item.id === id) {
        label = item.zh_name;
      }
    }
    return label;
  }
  /*
   * 搜索标签列表触发
   */
  handleTagChange = (value) => {
    this.setState({
      defaultSearchTags: value,
      checkedKeys: value
    });
  }
  /*
   * caseCauseMsg表单
   */
  caseCauseMsgFormChange = (name, index, e) => {
      let form = this.state.caseCauseMsgForm;
      form[name][index].typeValue = e.target ? e.target.value : e;
      if( name === 'selectTypes' ){
        const opt = form[name][index].options;
        for(let i = 0; i < opt.length; i++ ) {
          if ( form[name][index].typeValue === opt[i].optionId ) {
            form[name][index].typeValueName = opt[i].optionName
          }
        }
      }
      this.setState({
        caseCauseMsgForm: form
      });
      console.log(888888888,name, index,e.target ? e.target : e,this.state.caseCauseMsgForm);
  }
  render() {
    const { treeData, handleOk, handleCancel, visible } = this.props;
    const { predictPropertyForm, caseCauseMsgForm, checkedKeys, expandedKeys } = this.state;
    return (<Modal
      visible={visible} width={1217}
      onOk={handleOk.bind(this, this.state)} onCancel={handleCancel} style={{ height: 550 }}
    >
      <Notifications />
      <div>
        <div className="my_dialog" style={window.innerWidth ? { left: '50%' } : {left:'0'}}>
          <div className="edit_content">
            <h3><span>基本信息</span><span className="right">情节选择</span></h3>
            <div className="punish_content" >
              <h3>判罚结果 </h3>
              <table>
                {/* <!--主刑-->*/}
                <tbody>
                  <tr>
                    <td>请选择主刑 :</td>
                    <td>
                      <Select
                        value={this.state.main_punish_id}
                        size="large"
                        style={{ width: 200 }}
                        onChange={this.mainPunishChange.bind(this)}
                      >
                        {
                        Object.keys(this.state.main_punish_option).map(key => (
                          <Option key={key} value={key}>{this.state.main_punish_option[key].zh_name}</Option>
                        ))
                       }
                      </Select>
                    </td>
                  </tr>
                  {(() => {
                    const id = this.state.main_punish_id;
                    if (id) {
                      if (id === 'isLife' || id === 'deathPenalty') {
                        return null;
                      }
                      return (
                        <tr>
                          <td>
                            {this.state.main_punish_option[id].zh_name} :
                        </td>
                          <td>
                            <InputNumber
                              min={0}
                              value={this.state.main_punish_value}
                              onChange={this.prePunishInputChange.bind(this, id)}
                              style={{ width: 180 }}
                            />
                            {this.state.main_punish_option[id].UnitName}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })()}
                  <tr>
                    <td>罚金 :</td>
                    <td>
                      <InputNumber
                        min={0}
                        value={predictPropertyForm.fine}
                        onChange={this.punishInputChange.bind(this, 'fine')}
                        style={{ width: 180 }}
                      />
                    元
                  </td>
                  </tr>
                  <tr>
                    <td>缓刑 :</td>
                    <td>
                      <InputNumber
                        min={0}
                        value={predictPropertyForm.probationTime}
                        onChange={this.punishInputChange.bind(this, 'probationTime')}
                        style={{ width: 180 }}
                      />
                    个月
                  </td>
                  </tr>
                  <tr>
                    <td>剥夺政治权利时间 :</td>
                    <td>
                      <InputNumber
                        min={0}
                        value={predictPropertyForm.stripPoliticalRights}
                        onChange={this.punishInputChange.bind(this, 'stripPoliticalRights')}
                        style={{ width: 180 }}
                      />
                    年
                  </td>
                  </tr>
                  <tr>
                    <td>财产 :</td>
                    <td>
                      <Checkbox
                        checked={predictPropertyForm.confiscateProperty}
                        onChange={this.punishInputChange.bind(this, 'confiscateProperty')}
                      />没收全部个人财产
                  </td>
                  </tr>
                </tbody>
              </table>
              <h3>
                特殊情节
              </h3>
              <table>
                <tbody>
                  {/* <!--案由基本信息-->*/}
                  {caseCauseMsgForm ?
                  ((caseCauseMsgForm.textTypes ?
                    caseCauseMsgForm.textTypes : []).map((msg, index) => (<tr key={msg.typeName}>
                      <td>{msg.typeName}:</td>
                      <td><InputNumber
                        min={0}
                        defaultValue={msg.typeValue}
                        onChange={this.caseCauseMsgFormChange.bind(this, 'textTypes', index)}
                        style={{ width: 180 }}
                      />{msg.typeUnitName}
                      </td>
                    </tr>))) : null}
                  {caseCauseMsgForm ?
                  ((caseCauseMsgForm.selectTypes ? caseCauseMsgForm.selectTypes : []).map((msg, selectIndex) => {
                      return (<tr key={msg.typeName}>
                        <td>{msg.typeName}:</td>
                        <td>
                          <Select
                            size="large"
                            defaultValue={msg.typeValue}
                            style={{ width: 200 }}
                            onChange={this.caseCauseMsgFormChange.bind(this, 'selectTypes', selectIndex)}
                          >
                            {
                              (msg.options ? msg.options : []).map(opt =>
                                (<Option key={opt.optionId} value={opt.optionId}>{opt.optionName}</Option>))
                            }
                          </Select>
                        </td>
                      </tr>);
                  })) : null}
                  {/* <!--案由特殊标签选择-->*/}
                  <tr>
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tree" style={{border: 'none'}}>
              <p>标签搜索</p>
              <div className="select">
                <Select
                  size="large"
                  tags
                  style={{ width: 500 }}
                  searchPlaceholder="标签模式"
                  value={this.state.defaultSearchTags}
                  onChange={this.handleTagChange.bind(this)}
                >
                  {
                    this.state.searchTags.map(val => (<Option key={val.zh_name} value={val.id}>{val.zh_name}</Option>))
                  }
                </Select>
              </div>
              <CaseTree
                handleCheck={this.handleCheck}
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                treeData={treeData}
                handleSelect={this.handleSelect}
              />
            </div>
        </div>
          {
            localStorage.test_mode ?
              <button className="save_btn" onClick = {this.props.saveChange.bind(this, this.state)}>保 存</button>
              : null
          }
        </div>
      </div>
    </Modal>);
  }
}
CaseDialog.propTypes = {
  predictProperty: React.PropTypes.object.isRequired,
  caseCauseMsg: React.PropTypes.object.isRequired,
  treeData: React.PropTypes.array.isRequired,
  tags: React.PropTypes.array.isRequired,
  selectTags: React.PropTypes.array.isRequired,
  handleOk: React.PropTypes.func.isRequired,
  handleCancel: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired,
  caseCauseId: React.PropTypes.number.isRequired,
  saveChange: React.PropTypes.func.isRequired
};
export default CaseDialog;
