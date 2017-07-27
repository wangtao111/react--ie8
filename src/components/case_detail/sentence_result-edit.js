/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { Checkbox, InputNumber, Select } from 'antd';
import Component from '../../constants/Component';

const Option = Select.Option;

class SentenceResultEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      mainPunishOption: [// 主刑
        { id: 'prisonTerm', zh_name: '有期徒刑', value: '', UnitName: '个月' },
        { id: 'isLife', zh_name: '无期徒刑', value: true, UnitName: '' },
        { id: 'deathPenalty', zh_name: '死刑', value: true, UnitName: '' },
        { id: 'detention', zh_name: '拘役', value: '', UnitName: '天' },
        { id: 'control', zh_name: '管制', value: '', UnitName: '天' },
        { id: 'none', zh_name: '无', value: '', UnitName: '' }
      ],
      form: {}
    };
  }
  componentWillMount = () => {
    const pre = this.props.SentenceResultForm;
    this.setState({
      form: pre
    });
  }
  handleFormValueChange = (name, e) => {
    let change = {};
    let value = e.target ? e.target.value : e;
    change[name] = value;
    // 是否没收全部财产
    if (name === 'confiscateProperty') {
      value = e.target ? e.target.checked : e;
      change[name] = value;
    }
    change = Object.assign(this.state.form, change);
    this.setState({
      form: change
    });
  }
  handleMainPunishFormValueChange = (name, e) => {
    let change = {};
    const obj = {};
    // id的值
    const value = e.target ? e.target.value : e;
    const arr = this.state.mainPunishOption;
    // 改变下拉菜单
    if (name === 'id') {
      // 找到id为这个value的那个obj
      let mainPunish;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].id === value) {
          mainPunish = arr[i];
        }
        // 设置死刑和无期徒刑
        if (arr[i].id !== 'none') {
          obj[arr[i].id] = 0;
        }
        if (arr[i].id !== value && (arr[i].id === 'deathPenalty' || arr[i].id === 'isLife')) {
          obj[arr[i].id] = false;
        }
        if (arr[i].id === value && (arr[i].id === 'deathPenalty' || arr[i].id === 'isLife')) {
          obj[arr[i].id] = true;
        }
      }
      change.main_punish = mainPunish;
    } else {
      // 改变下拉菜单下面的input 个月
      change.main_punish = Object.assign(arr, { value });
      for (let i = 0; i < arr.length; i += 1) {
        // 设置除了死刑和无期徒刑以外的其他刑
        if (arr[i].id !== 'deathPenalty' && arr[i].id !== 'isLife') {
          obj[arr[i].id] = 0;
        }
      }
      obj[this.state.form.main_punish.id] = value;
    }
    change = Object.assign(this.state.form, change, obj);
    this.setState({
      form: change
    });
  }
  render() {
    const { toggleMode } = this.props;
    const { form, mainPunishOption } = this.state;
    return (
      <div className="basic_info">
        <div className="base_info_title clearfix">
          <div>判决结果</div>
          <div className="edit" onClick={toggleMode.bind(this, 'resultEdit', 'SentenceResultForm', this.state.form)}>
            <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
            <span style={{ color: '#21A0FF' }}>保存</span>
          </div>
        </div>
        <div className="basic_content"><span className="basic_title">请选择主刑：</span>
          <span className="basic_value">
            <Select
              value={form.main_punish ? form.main_punish.id : 'none'}
              showSearch
              style={{ width: '100px' }}
              notFoundContent="'找不到呐！'"
              searchPlaceholder="'请输入主刑id'"
              onChange={this.handleMainPunishFormValueChange.bind(this, 'id')}
            >
              {mainPunishOption.map(punish => (<Option value={punish.id} key={punish.id}>{punish.zh_name}</Option>))}
            </Select>
          </span>
        </div>
        {(() => {
          if (form.main_punish &&
            form.main_punish.id !== 'isLife' &&
            form.main_punish.id !== 'deathPenalty' &&
            form.main_punish.id !== 'none'
          ) {
            return (<div className="basic_content">
              <span className="basic_title">{form.main_punish.zh_name}：</span>
              <span className="basic_value">
                <InputNumber
                  style={{ width: '100px' }}
                  onChange={this.handleMainPunishFormValueChange.bind(this, 'value')}
                  value={form[form.main_punish.id]}
                />
                {form.main_punish.UnitName}
              </span>
            </div>);
          }
          return '';
        })()}
        <div className="basic_content">
          <span className="basic_title">罚金：</span>
          <span className="basic_value">
            <InputNumber
              style={{ width: '100px' }}
              onChange={this.handleFormValueChange.bind(this, 'fine')}
              value={form.fine || 0}
            />元</span>
        </div>
        <div className="basic_content">
          <span className="basic_title">缓刑：</span>
          <span className="basic_value">
            <InputNumber
              style={{ width: '100px' }}
              onChange={this.handleFormValueChange.bind(this, 'probation')}
              value={form.probation || 0}
            />个月</span>
        </div>
        <div className="basic_content">
          <span className="basic_title">财产：</span>
          <span className="basic_value">
            <Checkbox
              defaultChecked={form.confiscateProperty}
              onChange={this.handleFormValueChange.bind(this, 'confiscateProperty')}
            />
            没收全部个人财产
          </span>
        </div>
        <div className="basic_content">
          <span className="basic_title">剥夺政治权利时间：</span>
          <span className="basic_value">
            <InputNumber
              style={{ width: '100px' }}
              onChange={this.handleFormValueChange.bind(this, 'stripPoliticalRights')}
              value={form.stripPoliticalRights || 0}
            />年</span>
        </div>
      </div>
    );
  }
}
SentenceResultEdit.propTypes = {
  toggleMode: React.PropTypes.func.isRequired,
  SentenceResultForm: React.PropTypes.object.isRequired
};
export default SentenceResultEdit;
