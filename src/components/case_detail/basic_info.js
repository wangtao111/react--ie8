/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import moment from 'moment';
import { HashLocation } from 'redux';
import Component from '../../constants/Component';

class BaseInfo extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
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
  toPredict = () => {
    HashLocation.push('/');
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
  baseInfoHtml = () => {
    const { baseInfoForm, caseCauses } = this.props;
    let html = '';
    if (baseInfoForm.courtName) {
      html += `<div class="basic_content">
        <div class="basic_title">${baseInfoForm.docType === 7 ? '检察院' : '审理法庭'}</div>
        <div class="basic_value important">${baseInfoForm.courtName}</div>
      </div>`;
    }
    if (baseInfoForm.judgeName) {
      html += `<div class="basic_content">
        <div class="basic_title">审判人员</div>
        <div class="basic_value important">${baseInfoForm.judgeName}</div>
      </div>`;
    }
    if (baseInfoForm.caseNumber) {
      html += `<div class="basic_content">
        <div class="basic_title">案号</div>
        <div class="basic_value">${baseInfoForm.caseNumber}</div>
      </div>`;
    }
    if (baseInfoForm.caseCauseName) {
      html += `<div class="basic_content">
        <div class="basic_title">案由</div>
        <div class="basic_value important">${this.searchChName(baseInfoForm.caseCauseId, caseCauses)}</div>
      </div>`;
    }
    if (baseInfoForm.docTypeName) {
      html += `<div class="basic_content">
        <div class="basic_title">文书类型</div>
        <div class="basic_value">${baseInfoForm.docTypeName}</div>
      </div>`;
    }
    if (baseInfoForm.decideTime) {
      html += '<div class="basic_content">';
      if (baseInfoForm.docType !== 7) {
        html += '<div class="basic_title">审判日期</div>';
      } else {
        html += '<div class="basic_title">起诉日期</div>';
      }
      html += `<div class="basic_value">${moment(baseInfoForm.decideTime).format('YYYY/MM/DD')}</div>
      </div>`;
    }
    if (baseInfoForm.gradeName && baseInfoForm.docType !== 7) {
      html += `<div class="basic_content">
        <div class="basic_title">审理程序</div>
        <div class="basic_value">${baseInfoForm.gradeName}</div>
      </div>`;
    }
    if (baseInfoForm.applicableProcedure && baseInfoForm.docType !== 7) {
      html += `<div class="basic_content" >
        <div class="basic_title">程序类型</div>
        <div class="basic_value">${baseInfoForm.applicableProcedure === 1 ? '普通程序' : '简易程序'}</div>
      </div>`;
    }
    return { __html: html };
  }
  render() {
    const { toggleEditMode, mode } = this.props;
    return (
      <div>
        {Object.keys(this.props.baseInfoForm).length ? <div><div className="base_info_title clearfix">
          <div>基本信息</div>
          {mode ? <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/bianji.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleEditMode.bind(null, 'edit')}
            >编辑</span>
          </div> : null}
        </div>
          <div style={{ padding: '10px 0', background: '#FFFFFF' }} dangerouslySetInnerHTML={this.baseInfoHtml()} /></div> : ''}
      </div>
    );
  }
}
BaseInfo.propTypes = {
  baseInfoForm: React.PropTypes.object.isRequired,
  caseCauses: React.PropTypes.array.isRequired,
  toggleEditMode: React.PropTypes.func.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default BaseInfo;
