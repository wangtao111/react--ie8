import React from 'react';
import { HashLocation } from 'react-router';
import 'antd/lib/index.css';
import CaseDialog from './case_dialog';
import Component from '../../../../constants/Component';
import '../../../../less/case_warning/case_info.less';

class CaseInformation extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editDialog: true,
      visible: false,
      caseCauseMsg: []
    };
  };
  componentDidMount = () => {

  };
  showModal = () => {
    this.setState({
      visible: true
    });
    this.props.changeEchartsShow(false);
  }
  handleOk = (forms) => {
    this.setState({
      visible: false
    });
    console.log('-------------',forms);
    const editParams = [];
    const tagParams = [];
    const obj = forms.predictPropertyForm;
    const tags = this.props.tags;
    const case_info_keys = [];
    for (let i=0; i < tags.length; i += 1 ){
      case_info_keys.push(tags[i].name);
    }
    tagParams[0] = case_info_keys;
    tagParams[1] = forms.checkedKeys;
    for (let key of Object.keys(obj)) {
      if (key === 'prisonTerm' && obj[key]){
        editParams.push({type: 0, name: 'prison_term', value: obj[key]})
      }
      if (key === 'detentionTerm' && obj[key]){
        editParams.push({type: 0, name: 'detentionTerm', value: obj[key]})
      }
      if (key === 'control' && obj[key]){
        editParams.push({type: 0, name: 'control', value: obj[key]})
      }
      if (key === 'probationTime' && obj[key]){
        editParams.push({type: 0, name: 'probation', value: obj[key]})
      }
      if (key === 'fine' && obj[key]){
        editParams.push({type: 0, name: 'fine', value: obj[key]})
      }
      if (key === 'stripPoliticalRights' && obj[key]){
        editParams.push({type: 0, name: 'stripPoliticalRights', value: obj[key]})
      }
      if (key === 'confiscateProperty' && obj[key]){
        editParams.push({type: 0, name: 'confiscateProperty', value: obj[key]})
      }
    }
    const selectTypes = forms.caseCauseMsgForm.selectTypes;
    const textTypes = forms.caseCauseMsgForm.textTypes;
    if (selectTypes && selectTypes[0]){
      for (let i = 0;i < selectTypes.length;i += 1){
        if (selectTypes[i].typeValue){
          editParams.push({type: 1,name: selectTypes[i].typeId, value: selectTypes[i].typeValue})
        }
      }
    }
    if (textTypes && textTypes[0]) {
      for (let i = 0;i < textTypes.length;i += 1){
        if (textTypes[i].typeValue){
          editParams.push({type: 1,name: textTypes[i].typeId, value: textTypes[i].typeValue})
        }
      }
    }
    this.props.changeEchartsShow(true);
    this.props.changeResult(forms.predictPropertyForm);
    this.props.reload(editParams,tagParams);
    this.props.changeTags(forms.checkedKeys);
    this.props.changeCaseCauseMsg(forms.caseCauseMsgForm);
  }
  saveChange = (forms) => {
    const obj = forms.predictPropertyForm;
    const sen = {};
    const numTags = [];
    for (let key of Object.keys(obj)) {
      if ((key === 'prisonTerm' || key === 'detentionTerm' || key === 'control' || key === 'probationTime' || key === 'fine' || key === 'stripPoliticalRights' || key === 'confiscateProperty') && obj[key]){
        sen[key] = obj[key]
      }
    }
    const selectTypes = forms.caseCauseMsgForm.selectTypes;
    const textTypes = forms.caseCauseMsgForm.textTypes;
    if (selectTypes[0]){
      for (let i = 0;i < selectTypes.length;i += 1){
        if (selectTypes[i].typeValue){
          numTags.push({name: selectTypes[i].typeId, num: selectTypes[i].typeValue})
        }
      }
    }
    if (textTypes[0]) {
      for (let i = 0;i < textTypes.length;i += 1){
        if (textTypes[i].typeValue){
          numTags.push({name: textTypes[i].typeId, num: textTypes[i].typeValue})
        }
      }
    }
    console.log(sen,numTags);
    var params = {
      id: this.props.caseInfoId,
      sen: JSON.stringify(sen),
      tags: JSON.stringify(forms.checkedKeys),
      numTags: JSON.stringify(numTags)
    }
    this.$api.decision.saveCaseInfo.request(params).then((response) => {
      console.log("保存修改信息", response);
      if (!response.data.code){
        alert("保存成功");
      }else{
        alert("保存失败");
      }
    });
  }
  handleCancelDialog = () => {
    this.setState({
      visible: false
    });
    this.props.changeEchartsShow(true);
  }
  toDetail = () => {
    localStorage.caseDetailMode=true;
    HashLocation.push(`/case_detail?id=${this.props.caseInfoId}`);
  }
  render() {
    const { predictProperty, caseCauseMsg, treeData, tags, selectTags, caseInfoId } = this.props;
    return (<div className="case_info">
      <div className="basic_msg">
        <p>案件信息
          <span className="edit" onClick={this.showModal.bind(this)}><b /> 编辑</span>
        </p>
        <div className="table_box">
          <ul className="case_tags">
            {
              caseCauseMsg ?
                ((caseCauseMsg.textTypes ?
                caseCauseMsg.textTypes : []).map(msg => (msg.typeValue ?
                  <li key={msg.typeName} className="case case_importance">{msg.typeName} :
                  {msg.typeValue}{msg.typeUnitName}</li> : ''))) : ''
            }
            {
              caseCauseMsg ?
                ((caseCauseMsg.selectTypes ?
                caseCauseMsg.selectTypes : []).map(msg => (msg.typeValue ?
                  <li key={msg.typeName} className="case case_importance">{msg.typeName} :
                  {msg.typeValueName}</li> : ''))) : ''
            }
            {
              tags.map(tag => ( tag.details_importance === 1? <li key={tag.zh_name} className="case case_importance"> {tag.zh_name} </li> :null) )
            }
            {
              tags.map(tag => ( tag.details_importance !== 1? <li key={tag.zh_name} className="case"> {tag.zh_name} </li> :null) )
            }
            {
              predictProperty.stripPoliticalRights ?
                <li className="case">剥夺政治权利时间 :{this.props.predictProperty.stripPoliticalRights === 99 ? ' 终身' : this.props.predictProperty.stripPoliticalRights+' 年'} </li> : ''
            }
            {
              predictProperty.confiscateProperty ? <li className="case">财产 :没收全部个人财产</li> : ''
            }
          </ul>
        </div>
        <div className="detail_msg_btn">
          <div className="button" onClick={this.toDetail.bind(this)}>查看文书详情<b className="row" /></div>
        </div>
      </div>
      {
        this.state.visible ?
          <CaseDialog
            predictProperty={predictProperty}
            caseCauseMsg={caseCauseMsg}
            visible={this.state.visible}
            treeData={treeData}
            selectTags={selectTags}
            tags={this.props.tags}
            caseCauseId={this.props.caseCauseId}
            handleOk={this.handleOk}
            handleCancel={this.handleCancelDialog}
            saveChange={this.saveChange}
          /> : null
      }
    </div>);
  }
}
CaseInformation.propTypes = {
  predictProperty: React.PropTypes.object.isRequired,
  caseCauseMsg: React.PropTypes.object.isRequired,
  tags: React.PropTypes.array.isRequired,
  treeData: React.PropTypes.array.isRequired,
  selectTags: React.PropTypes.array.isRequired,
  reload: React.PropTypes.func.isRequired,
  caseInfoId: React.PropTypes.string.isRequired,
  caseCauseId: React.PropTypes.number.isRequired,
  changeResult: React.PropTypes.func.isRequired
};
export default CaseInformation;
