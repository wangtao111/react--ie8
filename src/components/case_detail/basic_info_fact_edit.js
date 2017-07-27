/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { InputNumber, Select } from 'antd';
import RecordsInfo from './recordsinfo';
import Component from '../../constants/Component';

const Option = Select.Option;
class BasicInfoFactEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: {
        textTypesValue: '',
        selectTypesValue: ''
      },
      predictTextTypesForm: [],
      predictSelectTypesForm: [],
      type_record: [{
        value: 1,
        label: '行政拘留'
      }, {
        value: 2,
        label: '劳动教养'
      }, {
        value: 3,
        label: '普通前科'
      }],
      recordsesForm: []
    };
  }
  handlepredictTextTypesFormValueChange = (name, index, e) => {
    const change = [].concat(this.state.predictTextTypesForm);
    change[index][name] = e.target ? e.target.value : e;
    this.setState({
      predictTextTypesForm: change
    });
  }
  handlepredictSelectTypesFormValueChange = (name, index, e) => {
    const change = [].concat(this.state.predictSelectTypesForm);
    change[index][name] = e.target ? e.target.value : e;
    this.setState({
      predictSelectTypesForm: change
    });
  }
  render = () => {
    const { factInfoForm, toggleMode, handleFactTag, caseCauses, mode } = this.props;
    const { predictTextTypesForm, predictSelectTypesForm } = this.state;
    return (
      <div>
        <div className="base_info_title clearfix">
          <div>{factInfoForm.caseInfo.topCauseId !== 1 ? '事实标签' : '犯罪事实标签'}</div>
          <div className="edit" onClick={toggleMode.bind(this, 'factEdit', 'fact_info_form', this.state.form)}>
            <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
            <span style={{ color: '#21A0FF' }}>保存</span>
          </div>
        </div>
        {factInfoForm.caseCauseMsg ? factInfoForm.caseCauseMsg.textTypes.map((msg, index) => {
          this.state.predictTextTypesForm[index] = msg;
          return (<div className="basic_content" key={msg.typeName}>
            <div className="basic_title">{msg.typeName} :</div>
            <div className="basic_value">
              <InputNumber
                defaultValue={predictTextTypesForm[index].typeValue}
                onChange={this.handlepredictTextTypesFormValueChange.bind(null, 'typeValue', index)}
              />
            </div>
          </div>);
        }) : ''}
        {factInfoForm.caseCauseMsg ? factInfoForm.caseCauseMsg.selectTypes.map((msg, index) => {
          this.state.predictSelectTypesForm[index] = msg;
          return (<div className="basic_content" key={msg.typeName}>
            <div className="basic_title">{msg.typeName} :</div>
            <div className="basic_value">
              <Select
                value={predictSelectTypesForm[index].typeValue}
                style={{ width: 250 }}
                onChange={this.handlepredictSelectTypesFormValueChange.bind(null, 'typeValue', index)}
              >
                {msg.options.map(opt => (<Option value={opt.optionId} key={opt.optionId}>{opt.optionName}</Option>))}
              </Select>
            </div>
          </div>);
        }) : ''}
        {factInfoForm.factTag.map((item, index) => (
          <div className="basic_content" key={item.zhName}>
            <div className="tags_edit"><b>{item.zhName}</b>
              <span onClick={handleFactTag.bind(null, index)} /></div>
          </div>))}
        <RecordsInfo criminalRecords={factInfoForm.caseInfo.records} caseCauses={caseCauses} mode={mode} />
      </div>);
  }
}
BasicInfoFactEdit.propTypes = {
  factInfoForm: React.PropTypes.object.isRequired,
  caseCauses: React.PropTypes.array.isRequired,
  toggleMode: React.PropTypes.func.isRequired,
  handleFactTag: React.PropTypes.func.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default BasicInfoFactEdit;
