/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import moment from 'moment';
import Component from '../../constants/Component';
import Records from './records';

class RecordsInfo extends Component {
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
  _handleRecordsesFormValueChange = (name, index, e) => {
    const change = [].concat(this.state.recordsesForm);
    change[index][name] = e.target ? e.target.value : e;
    this.setState({
      recordsesForm: change
    });
  }
  changeRecordStatus = (records, action, index) => {
    const obj = Object.assign([], this.state.recordsesForm);
    // 保存的时候保持展开
    if (action === 'save') {
      obj[index].show = true;
      obj[index].edit = !obj[index].edit;
    } else {
      obj[index][action] = !obj[index][action];
    }
    this.setState({
      recordsesForm: obj
    });
  }
  // 查找标签中文名
  searchChName = (id, List) => {
    let label = '';
    for (let i = 0; i < List.length; i += 1) {
      if (List[i].id === Number(id)) {
        label = List[i].name;
      }
    }
    return label;
  }
  render = () => {
    const { criminalRecords, caseCauses, mode } = this.props;
    return (<div>
      {(criminalRecords || []).map((records, index) => {
        this.state.recordsesForm[index] = records;
        return (<div className="record" key={index}>
          <div className="record_title">
            <span />
            <span>{records.data.partyName || ''}前科信息:</span>
            {mode ? <span onClick={this.changeRecordStatus.bind(null, records, records.edit ? 'save' : 'edit', index)}>
              {records.edit ? '保存' : '编辑'}
            </span> : null}
          </div>
          <span
            style={{ margin: '10px 0', color: '#21A0FF', display: 'inline-block', paddingLeft: '36px', cursor: 'pointer' }}
            onClick={this.changeRecordStatus.bind(null, records, 'show', index)}
          >
            {(() => {
              if (records.show || records.edit) {
                return (<img alt="aegis" src={require('../../assets/case_detail/sanjiao.png')} />);
              }
              return (<img alt="aegis" src={require('../../assets/case_detail/sanjiao.png')} style={{ transform: 'rotate(270deg)' }} />);
            })()}
            {this.searchChName(records.causeId, caseCauses) || '刑事案'}
          </span>
          {(() => {
            // 展示模式非编辑状态
            if (records.edit) {
              return (<Records criminalRecords={[records]} caseCauses={caseCauses} />);
            } else if (records.show && !records.edit) {
              return (<div>
                {records.data.partyName ? <div className="basic_content">
                  <div className="basic_title">姓名</div>
                  <div className="basic_value">{records.data.partyName}</div>
                </div> : ''}
                <div className="basic_content">
                  <div className="basic_title">案由</div>
                  <div className="basic_value">
                    {this.searchChName(records.causeId, caseCauses) || '刑事案'}
                  </div>
                </div>
                <div className="basic_content">
                  <div className="basic_title">前科类型</div>
                  <div className="basic_value">
                    {(() => {
                      switch (records.type) {
                      case 0:
                        return '未归类';
                      case 1:
                        return '行政拘留';
                      case 2:
                        return '劳动教养';
                      case 3:
                        return '普通前科';
                      default:
                        return '';
                      }
                    })()}
                  </div>
                </div>
                {records.government ? <div className="basic_content">
                  <div className="basic_title">处罚机关</div>
                  <div className="basic_value">
                    {records.government}
                  </div>
                </div> : ''}
                {records.fine ? <div className="basic_content">
                  <div className="basic_title">罚金</div>
                  <div className="basic_value">
                    {records.fine} 元
                  </div>
                </div> : ''}
                {records.time ? <div className="basic_content">
                  <div className="basic_title">处罚时间</div>
                  <div className="basic_value">
                    {(() => moment(records.time).format('YYYY/MM/DD'))()}
                  </div>
                </div> : ''}
                {records.data.fine ||
                records.data.probation ||
                records.data.stripPoliticalRights ||
                records.data.prisonTerm ?
                  <div className="basic_content">
                    <div className="basic_title" style={{ color: '#21A0FF', float: 'left' }}>
                      法院判决
                    </div>
                    <div className="basic_value">
                      {records.data.fine ?
                        <div style={{ paddding: '0', margin: '0' }}>罚金:
                          <span style={{ color: '#111' }}>{records.data.fine} 元</span>
                        </div> : null}
                      {records.data.probation ?
                        <div style={{ paddding: '0', margin: '0' }}>缓刑:
                          <span style={{ color: '#111' }}>{records.data.probation} 月</span>
                        </div> : null}
                      {records.data.stripPoliticalRights ?
                        <div style={{ paddding: '0', margin: '0' }}>剥夺政治权利时间:
                          <span style={{ color: '#111' }}>{records.data.probation} 年</span>
                        </div> : null}
                      {records.data.prisonTerm ?
                        <div style={{ paddding: '0', margin: '0' }}>有期徒刑:
                          <span style={{ color: '#111' }}>{records.data.prisonTerm} 个月</span>
                        </div> : null}
                    </div>
                  </div> : ''}
              </div>);
            }
            return '';
          })()}
        </div>);
      })}
    </div>);
  }
}
RecordsInfo.propTypes = {
  caseCauses: React.PropTypes.array.isRequired,
  criminalRecords: React.PropTypes.array.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default RecordsInfo;
