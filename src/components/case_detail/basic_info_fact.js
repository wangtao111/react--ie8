/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import RecordsInfo from './recordsinfo';

class BasicInfoFact extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      recordsesForm: [],
      criminalRecords: [
        {
          name: 'candy',
          causeId: 21,
          government: 22,
          fine: 1000,
          time: '2015/09/09'
        }
      ]
    };
  }
  goAnchor = (key) => {
    console.log(key);
    let anchor = '';
    const url = document.location.href.split('#');
    if (key) {
      anchor = key;
      HashLocation.push(`${url[1]}#${anchor}`);
    } else {
      anchor = url[2];
    }
    const element = document.getElementById(anchor);
    if (element) element.scrollIntoView();
  }
  render() {
    const { factInfoForm, caseCauses, criminalRecords, toggleEditMode, mode } = this.props;
    return (
      <div className="basic_info">
        <div className="base_info_title clearfix">
          <div>{factInfoForm.caseInfo.topCauseId !== 1 ? '事实标签' : '犯罪事实标签'}</div>
          {mode ? <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/bianji.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleEditMode.bind(this, 'factEdit')}
            >编辑</span>
          </div> : ''}
        </div>
        <div style={{ background: '#ffffff', padding: '10px 25px' }}>
          <div>
            {/* 盗窃罪和故意伤害罪*/}
            {factInfoForm.caseCauseMsg.textTypes ? factInfoForm.caseCauseMsg.textTypes.map((msg) => {
              if (msg.typeValue) {
                return (<div
                  className="basic_content"
                  key={msg.typeName}
                ><div className="tags">
                  {msg.typeName} :
                  <span>&nbsp;{msg.typeValue} {msg.typeUnitName}</span>
                </div>
                </div>);
              }
              return '';
            }) : ''}
            {/* 毒品*/}
            {factInfoForm.caseCauseMsg.selectTypes ? factInfoForm.caseCauseMsg.selectTypes.map((msg) => {
              if (msg.typeValueName) {
                return (<div className="basic_content" key={msg.typeName}>
                  <div className="tags">
                    {msg.typeName} :
                  <span>&nbsp;{msg.typeValueName}</span>
                  </div>
                </div>);
              }
              return '';
            }) : ''}
            {factInfoForm.factTag.map(item => (
              <div className="basic_content" key={item.zhName}>
                <div className="tags">
                  <a onClick={this.goAnchor.bind(this, item.startPos)}>{item.zhName}</a>
                </div>
              </div>))}
            {/* 前科信息TODO*/}
            <RecordsInfo criminalRecords={criminalRecords} caseCauses={caseCauses} mode={mode} />
          </div>
        </div>
      </div>
    );
  }
}
BasicInfoFact.propTypes = {
  factInfoForm: React.PropTypes.object.isRequired,
  caseCauses: React.PropTypes.array.isRequired,
  criminalRecords: React.PropTypes.array.isRequired,
  toggleEditMode: React.PropTypes.func.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default BasicInfoFact;
