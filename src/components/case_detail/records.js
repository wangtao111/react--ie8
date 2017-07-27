/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import Select from 'antd/lib/select';
import moment from 'moment';
import Component from '../../constants/Component';

class Records extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      recordsesForm: [],
      type_record: [{
        value: 1,
        label: '行政拘留'
      }, {
        value: 2,
        label: '劳动教养'
      }, {
        value: 3,
        label: '普通前科'
      }]
    };
  }
  handleRecordsesFormValueChange = (name, index, e) => {
    let change = [].concat(this.state.recordsesForm);
    change[index][name] = e.target ? e.target.value : e;
    if (name === 'time') {
      change = Object.assign(change, {
        time: new Date(change.time).getTime()
      });
    }
    if (name === 'name') {
      change = Object.assign(
        change,
        Object.assign(
          this.state.recordsesForm[index].data,
          { partyName: change[index][name] }
          )
      );
    }
    this.setState({
      recordsesForm: change
    });
  }
  render = () => {
    const { criminalRecords, caseCauses } = this.props;
    const { recordsesForm, type_record } = this.state;
    return (<div>
      {(criminalRecords || []).map((records, index) => {
        this.state.recordsesForm[index] = records;
        this.state.recordsesForm[index].name = records.data.partyName;
        return (<div className="record" key={index}>
          <div className="basic_content">
            <div className="basic_title">姓名</div>
            <div className="basic_value">
              <Input
                placeholder="请输入内容"
                onChange={this.handleRecordsesFormValueChange.bind(null, 'name', index)}
                value={recordsesForm[index].name}
              />
            </div>
          </div>
          <div className="basic_content">
            <div className="basic_title">案由</div>
            <div className="basic_value">
              <select
                className="selector"
                value={recordsesForm[index].causeId}
                onChange={this.handleRecordsesFormValueChange.bind(null, 'causeId', index)}
              >
                {caseCauses.map(item => (<option value={item.id} key={item.id}>{item.name}</option>))}
              </select>
            </div>
          </div>
          <div className="basic_content">
            <div className="basic_title">前科类型</div>
            <div className="basic_value">
              <Select
                value={recordsesForm[index].type}
                style={{ width: 200 }}
                onChange={this.handleRecordsesFormValueChange.bind(null, 'type', index)}
              >
                {type_record.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>))}
              </Select>
            </div>
          </div>
          <div className="basic_content">
            <div className="basic_title">处罚机关</div>
            <div className="basic_value">
              <Input
                placeholder="请输入内容"
                onChange={this.handleRecordsesFormValueChange.bind(null, 'government', index)}
                value={recordsesForm[index].government}
              />
            </div>
          </div>
          <div className="basic_content">
            <div className="basic_title">罚金</div>
            <div className="basic_value">
              <InputNumber
                defaultValue={recordsesForm[index].fine || 0}
                onChange={this.handleRecordsesFormValueChange.bind(null, 'fine', index)}
              /> 元
            </div>
          </div>
          <div className="basic_content">
            <div className="basic_title">处罚时间</div>
            <div className="basic_value">
              <DatePicker
                defaultValue={(() => moment(recordsesForm[index].time).format('YYYY/MM/DD'))()}
                onChange={this.handleRecordsesFormValueChange.bind(null, 'time', index)}
                format="yyyy/MM/dd"
              />
            </div>
          </div>
        </div>);
      })}
    </div>);
  }
}
Records.propTypes = {
  caseCauses: React.PropTypes.array.isRequired,
  criminalRecords: React.PropTypes.array.isRequired
};
export default Records;
