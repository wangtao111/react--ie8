/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import moment from 'moment';
import { Input, DatePicker, Select } from 'antd';
import Component from '../../constants/Component';

const Option = Select.Option;
class BasicInfoEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      caseCauses: [],
      form: {
        docType: '',
        docTypeName: '',
        courtName: '',
        judgeName: '',
        caseNumber: '',
        gradeName: '',
        caseCauseId: '',
        decideTime: ''
      },
      // 文书类型选择
      type_options: [{
        value: 0,
        label: '诉讼状'
      }, {
        value: 1,
        label: '判决书'
      }]
    };
  }
  componentWillMount = () => {
    this.setState({
      form: this.props.baseInfoForm
    });
  }
  // 查找标签中文名
  searchChName = (value, List) => {
    let label = '';
    for (let i = 0; i < List.length; i += 1) {
      if (List[i].id === Number(value)) {
        label = List[i].name;
      }
    }
    return label;
  }
  handleFormValueChange = (name, e) => {
    let change = { form: {} };
    change.form[name] = e.target ? e.target.value : e;
    change = Object.assign(this.state.form, change.form);
    if (name === 'docType') {
      change = Object.assign(change, {
        docTypeName: this.searchChName(change.docType, this.state.type_options)
      });
    }
    if (name === 'decideTime') {
      change = Object.assign(change, {
        decideTime: new Date(change.decideTime).getTime()
      });
    }
    if (name === 'caseCauseId') {
      change = Object.assign(change, {
        caseCauseName: this.searchChName(change[name], this.props.caseCauses)
      });
    }
    this.setState({
      form: change
    });
  }

  render = () => {
    const { baseInfoForm, caseCauses, toggleMode } = this.props;
    // this.toggleMode = toggleMode.bind(this);
    const { type_options, form } = this.state;
    return (
      <div>
        <div className="base_info_title clearfix">
          <div>基本信息</div>
          <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleMode.bind(this, 'edit', 'base_info_form', form)}
            >保存</span>
          </div>
        </div>
        {(() => {
          if (Object.keys(baseInfoForm).length) {
            return (<div>
              <div className="basic_content">
                <div className="basic_title">{baseInfoForm.docType === 7 ? '检察院' : '审理法庭'}</div>
                <div className="basic_value important">
                  <Input
                    placeholder="请输入内容"
                    onChange={this.handleFormValueChange.bind(null, 'courtName')}
                    value={form.courtName}
                  />
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">审判人员</div>
                <div className="basic_value important">
                  <Input placeholder="请输入内容" onChange={this.handleFormValueChange.bind(null, 'judgeName')} value={form.judgeName} />
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">案号</div>
                <div className="basic_value important">
                  <Input placeholder="请输入内容" onChange={this.handleFormValueChange.bind(null, 'caseNumber')} value={form.caseNumber} />
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">案由</div>
                <div className="basic_value">
                  {(() => {
                    if (caseCauses.length > 0 && baseInfoForm.caseCauseId) {
                      return (
                        <select
                          className="selector"
                          value={baseInfoForm.caseCauseId}
                          onChange={this.handleFormValueChange.bind(null, 'caseCauseId')}
                        >
                          {caseCauses.map(item => (<option value={item.id} key={item.id}>{item.name}</option>))}
                        </select>
                      );
                    }
                    return '';
                  })()}
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">审理程序</div>
                <div className="basic_value important">
                  <Input placeholder="请输入内容" onChange={this.handleFormValueChange.bind(null, 'gradeName')} value={form.gradeName} />
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">文书类型</div>
                <div className="basic_value important">
                  <Select defaultValue={form.docType} onChange={this.handleFormValueChange.bind(null, 'docType')} style={{ width: 200 }}>
                    {type_options.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>))}
                  </Select>
                </div>
              </div>
              <div className="basic_content">
                <div className="basic_title">审判日期</div>
                <div className="basic_value">
                  <DatePicker
                    defaultValue={(() => `${moment(form.decideTime).format('YYYY/MM/DD')}`)()}
                    onChange={this.handleFormValueChange.bind(null, 'decideTime')}
                    format="yyyy/MM/dd"
                  />
                </div>
              </div>
            </div>);
          }
          return '';
        })()}
      </div>);
  }
}
BasicInfoEdit.propTypes = {
  baseInfoForm: React.PropTypes.object.isRequired,
  toggleMode: React.PropTypes.func.isRequired,
  caseCauses: React.PropTypes.array.isRequired
};

module.exports = BasicInfoEdit;
