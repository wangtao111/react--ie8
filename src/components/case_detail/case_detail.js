/**
 * Created by Candy on 2017/3/23.
 */
import React from 'react';
import Checkbox from 'antd/lib/checkbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HashLocation } from 'react-router';
import { Input, message, Spin, Icon, Button, Modal } from 'antd';
import moment from 'moment';
import Component from '../../constants/Component';
import '../../less/case_detail/case_detail.less';
import '../../less/case_detail/left.less';
import '../../less/case_detail/right.less';
import '../../less/case_detail/fact.less';
import BasicInfo from './basic_info';
import BasicInfoEdit from './basic_info_edit';
import BasicInfoParty from './basic_info_party';
import BasicInfoPartyEdit from './basic_info_party_edit';
import BasicInfoFact from './basic_info_fact';
import BasicInfoFactEdit from './basic_info_fact_edit';
import SentenceResult from './sentence_result';
import SentenceResultEdit from './sentence_result-edit';
import LawTag from './law_tag';
import LawTagEdit from './law_tag_edit';

class CaseDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      caseDetailMode: false,
      dialogVisible:false,
      loading: true,
      SentenceResultForm: {},
      factInfoForm: {
        caseCauseMsg: {},
        caseInfo: {},
        factTag: []
      },
      lawTagForm: [],
      partyInfoForm: [],
      baseInfoForm: {},
      caseInfo: {},
      basic_info: {},
      paraTag: {},
      paraTags: [],
      paraGroups: {},
      errPos:[],
      tagMap: {},
      termMessages: {},
      caseCauses: [],
      party: [],
      edit: false, // 编辑模式
      partyEdit: false,
      factEdit: false,
      resultEdit: false,
      lawEdit: 0,
      lawTags: [],
      lawMap: {},
      tags: [],
      sentenceTags: [],
      laws: [],
      // 编辑用的段落信息
      paraMap: {},
      basic: '',
      checkError: {
        parseErrorValue:0,//解析错误_解析值错误
        parseErrorName:0,//解析错误_人名错误
        parseErrorPara:0,//解析错误_段落分错
        parseErrorCaseCause:0,//解析错误_案由分错
        parseErrorTime:0,//判决结果解析错误
        parseErrorTagWrong:0,//解析错误_标签打错
        parseErrorNoTag:0,//解析错误_标签未打中
        predictErrorSimilarCases:0,//模型错误_类案错误
        predictErrorTooLow:0,//模型错误_预判太低
        predictErrorTooHigh:0,//模型错误_预判太高
        predictErrorRuleOverlay:0,//模型错误_规则叠加
        dataErrorValue:0, //数据异常_文书数值错误
        dataErrorUnit:0,//数据异常_单位错误
        dataErrorLessReason:0,//数据异常_说理不充分
        dataErrorUnusual:0,//数据异常_文书异常
        dataErrorPrisonTerm:0,//数据异常_刑期错误
        dataErrorTime:0,//数据异常_时间错误
        dataErrorAmount:0,//数据异常_金额错误
        multiDefendant:0,//文书复杂_多被告
        multiCaseCause:0//文书复杂_多案由
      },
      describe:'',
      questionShow: true,
      tabHidden: false
    };
    this.id = "";
  }

  componentWillMount = () => {
    const url = document.location.href;
    if(url.indexOf('&') !== -1){
      this.setState({tabHidden: true});
    }
    this.reload();
  };
  componentDidUpdate = () => {
    //var n = document.getElementById("clear_click");
    //n.oncontextmenu = function(){
    //  return false;
    //}
  };
  reload = () => {
    const search = window.location.hash.split('&')[0].split('?')[1];
    //this.setState({ caseDetailMode: JSON.parse(localStorage.caseDetailMode) });
    const id = search ? search.split('=')[1] : '';
    this.id = id;
    const param = id ? id.split('#')[0] : '';
    if (localStorage.test_mode) {
      this.$api.decision_result.get_check_info.request({id : this.id}).then((response) => {
        console.log("保存后的信息", response);
        const n=response.data.data;
        if(response.data.code === 0){
          if (n['checkOk'] === 1){
            console.log("文书已经检查,没有错误")
          }
          for (var key of Object.keys(n)) {
            if (n[key] === 1 && key !== 'checkOk'){
              console.log("文书已经检查完成")
            }
          }
          this.setState({
            checkError: n
          });
          this.setState({describe: n["otherError"]});
        }
      })
    }
    Promise.all([
      this.$api.decision.case.request({ id: param }),
      this.$api.decision.inputValue.request({ caseId: param }),
      this.$api.decision.message.request({ id: param })
    ]).then((results) => {

      const res = results[0].data.data || '';
      const res1 = results[1].data.data || '';
      const res2 = results[2].data.data || '';
      // console.log(res);
      // console.log(res1);
      // console.log(res2);
      if (!res) {
        message.error(results[0].data.msg);
      } else {
        console.log("详情案例信息",res);
        console.log("判罚结果信息",res1);
        console.log("事实标签信息",res2);
        const factForm = Object.assign(
          this.state.factInfoForm,
          { caseInfo: res.caseInfo },
          { caseCauseMsg: res1 },
          { factTag: res2.factTags }
        );
        let outDay = '';
        if (res.caseInfo.parties){
          if(res.caseInfo.parties[0].handle){
            if (res.caseInfo.parties[0].handle.outDay){
              outDay = res.caseInfo.parties[0].handle.outDay;
            }
          }
        }
        let errPos=[];
        if(res.caseInfo.errMsg){
          for (let i=0;i<res.caseInfo.errMsg.length;i++){
            res.caseInfo.errMsg[i].pos=res.caseInfo.errMsg[i].pos.split(',');
            if(res.caseInfo.errMsg[i].pos){
              for(let m=0;m<res.caseInfo.errMsg[i].pos.length;m++){
                errPos.push(res.caseInfo.errMsg[i].pos[0]);
              }
            }
          }
        }
        this.setState({errPos});
        if(res.paraGroups){
          for (var key of Object.keys(res.paraGroups)){
            if(res.paraGroups[key]){
              for(let i=0;i<res.paraGroups[key].length;i++){
                for(let j=0;j<res.paraGroups[key][i].length;j++){
                  res.paraGroups[key][i][j].showErr=true;
                  if(res.caseInfo.errMsg){
                    for (let k=0;k<res.caseInfo.errMsg.length;k++){
                      for(let l=0;l<res.caseInfo.errMsg[k].pos.length;l++){
                        if(res.caseInfo.errMsg[k].pos[l] == res.paraGroups[key][i][j].id && !res.caseInfo.errMsg[k].delete){
                          res.paraGroups[key][i][j].err = true;
                          console.log(888888,res.paraGroups[key][i][j].err);
                        }
                        if(res.caseInfo.errMsg[k].pos.indexOf(res.paraGroups[key][i][j].id)!=-1){
                          res.paraGroups[key][i][j].alertMsg = res.caseInfo.errMsg[k].msg;
                        }
                        if(this.state.errPos.indexOf(res.paraGroups[key][i][j].id) !== -1){
                          for (let i=0;i<res.caseInfo.errMsg.length;i++){
                            for(let m=0;m<res.caseInfo.errMsg[i].pos.length;m++){
                              if(res.caseInfo.errMsg[i].pos.indexOf(res.paraGroups[key][i][j].id) !== -1){
                                console.log(res.caseInfo.errMsg[i].msg);
                                res.paraGroups[key][i][j].msg = res.caseInfo.errMsg[i].msg;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.setState({
          caseInfo: res.caseInfo,
          baseInfoForm: res.caseInfo,
          factInfoForm: factForm,
          paraMap: res.paraMap,
          laws: res.laws,
          paraTags: res.paraTags,
          paraGroups: res.paraGroups,
          tagMap: res.tagMap,
          termMessages: res.termMessages,
          caseCauses: res2.caseCauses,
          partyInfoForm: res2.partyMessages,
          factTag: res2.factTags,
          lawTagForm: res2.lawTags,
          lawMap: res2.lawMap,
          SentenceResultForm: Object.assign(res.caseInfo.sentences&&res.caseInfo.sentences[0] ? res.caseInfo.sentences[0] : {}, { caseCauseMsg: res1 },{outDay}),
          loading: false
        });
        console.log(this.state.SentenceResultForm);
        this.goAnchor();
      }
    });
  }
  submit = (allClear) => {
    const n=this.state.checkError,params={};
    if(allClear){
      params["checkOk"] = 1;
    }else{
      for (var key of Object.keys(n)) {
        if (n[key] === true || n[key] === 1 ){
          params[key] = 1;
        }
      }
      params["otherError"] = this.state.describe;
    }
    params["id"] = this.id;
    this.$api.decision_result.save_check_info.request(params).then((response) => {
      console.log("保存后参数",params,"保存后信息",response);
      if (!response.data.code){
        alert("提交成功");
      }
    }).catch(function (response) {
      console.error("参数",params,"错误信息",response);
      alert("提交失败");
      return
    });
  };
  saveCaseDetail = () => {};
  goAnchor = (key) => {
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
  };
  toggleMode = (editName, formName, formObj) => {
    this.setState({
      [editName]: !this.state[editName],
      [formName]: formObj
    });
  };
  toggleEditMode = (editName) => {
    this.setState({
      [editName]: !this.state[editName]
    });
  };
  // 犯罪标签管理
  handleFactTag = (index) => {
    this.state.factInfoForm.factTag.splice(index, 1);
    this.setState({
      factInfoForm: this.state.factInfoForm
    });
  };
  handleLawTag = (index) => {
    this.state.lawTagForm.splice(index, 1);
    this.setState({
      lawTagForm: this.state.lawTagForm
    });
  };
  // 查找标签中文名
  searchChName = (value, List) => {
    let label = '';
    for (let i = 0; i < List.length; i += 1) {
      if (List[i].id === value) {
        label = List[i].name;
      }
    }
    return label;
  };
  // 段落编辑
  toggleParaMode = (key) => {
    const oldMode = this.state.paraMap[key].editMode;
    if (oldMode === 'done' || !oldMode) {
      this.state.paraMap[key].editMode = true;
    } else if (oldMode === true) {
      this.state.paraMap[key].editMode = 'done';
    }
    this.setState({
      paraMap: this.state.paraMap
    });
  };
  handleParaValueChange = (key, e) => {
    this.state.paraMap[key].value = e.target.value;
    this.setState({
      paraMap: this.state.paraMap
    });
  };
  changeCheck = (name) => {
    const change = {};
    change[name] = !this.state.checkError[name];
    this.setState({
      checkError: Object.assign(this.state.checkError, change)
    });
    console.log(this.state.checkError);
  };
  showDialog = (id) => {
    this.setState({dialogVisible: true});
    console.log(id);
    this.setState({errId:id});
  };
  deleteErr = () => {
    var pos = "";
    console.log(this.state.errId);
    for (let i=0;i<this.state.caseInfo.errMsg.length;i++){
      for(let m=0;m<this.state.caseInfo.errMsg[i].pos.length;m++){
        if(this.state.caseInfo.errMsg[i].pos.indexOf(this.state.errId)!=-1){
          pos = this.state.caseInfo.errMsg[i].pos.join(',');
        }
      }
    }
    this.setState({dialogVisible: false});
    var params={id:this.state.caseInfo.id,pos:pos};
    this.$api.decision.deleteErr.request(params).then((response) => {
      console.log("删除错误",params,response);
      if(!response.data.code){
        this.reload();
        alert('删除成功！');
      }
    });
  };
  handleCancel = () => {

  };
  showErrFunc = (id) => {
    var paraGroups = this.state.paraGroups;
    console.log(id);
    for (var key of Object.keys(paraGroups)){
      for(let i=0;i<paraGroups[key].length;i++){
        for(let j=0;j<paraGroups[key][i].length;j++){
          if(paraGroups[key][i][j].id==id){
            paraGroups[key][i][j].showErr = !paraGroups[key][i][j].showErr;
          }
        }
      }
    }
    this.setState({paraGroups});
  };
  returnErrFont = (pos) => {
    if(this.state.errPos.indexOf(pos) !== -1){
      for (let i=0;i<this.state.caseInfo.errMsg.length;i++){
        for(let m=0;m<this.state.caseInfo.errMsg[i].pos.length;m++){
          if(this.state.caseInfo.errMsg[i].pos.indexOf(pos)!=-1){
            console.log(this.state.caseInfo.errMsg[i].msg);
            return this.state.caseInfo.errMsg[i].msg;
          }
        }
      }
    }
  };
  alert = (e) => {

  }

  render = () => {
    const { caseInfo, caseCauses, paraTags, laws, paraGroups, tagMap, paraMap,
      termMessages, baseInfoForm, partyInfoForm, factInfoForm, SentenceResultForm,
      lawTagForm, lawMap, caseDetailMode, checkError, describe, questionShow, errPos, dialogVisible} = this.state;
    return (
      <div id="detail">
        {this.state.loading ? <div className="loading">
          <Spin size="large" />
        </div> : null}
        <Modal
          visible={dialogVisible} width={'40%'} className="err_dialog"
          onOk={this.deleteErr.bind(this)} onCancel={() => {this.setState({dialogVisible:false})}} style={{ color:'red' }}
        >
          是否删除当前错误标注 ？
        </Modal>
        {
          localStorage.test_mode ?
            <div id="question_return">
              {
                questionShow ?
                  <div onClick={() => {this.setState({questionShow : !questionShow})}} className="to_left">
                    <Icon type="double-left" size="large"/>
                    收起
                  </div>
                  : null
              }
              {
                !questionShow ?
                  <div onClick={ () => {this.setState({questionShow : !questionShow})}} className="to_right">
                    <Icon type="double-right" size="large"/>
                    展开
                  </div>
                  : null
              }
              {
                questionShow ?
                  <div className="question_content">
                    <h4>问题反馈：</h4>
                    <div>
                      一 、解析错误
                      <p>
                        <Checkbox checked={checkError.parseErrorValue} onChange={this.changeCheck.bind(this,"parseErrorValue")}/>1. 数据解析错误<br/>
                        <Checkbox checked={checkError.parseErrorTagWrong} onChange={this.changeCheck.bind(this,"parseErrorTagWrong")}/>2. 标签打错<br/>
                        <Checkbox checked={checkError.parseErrorNoTag} onChange={this.changeCheck.bind(this,"parseErrorNoTag")}/>3. 标签未打中<br/>
                        <Checkbox checked={checkError.parseErrorTime} onChange={this.changeCheck.bind(this,"parseErrorTime")}/>4. 判决结果解析错误<br/>
                        <Checkbox checked={checkError.parseErrorName} onChange={this.changeCheck.bind(this,"parseErrorName")}/>5. 人名解析错误<br/>
                        <Checkbox checked={checkError.parseErrorPara} onChange={this.changeCheck.bind(this,"parseErrorPara")}/>6. 段落分错<br/>
                        <Checkbox checked={checkError.parseErrorCaseCause} onChange={this.changeCheck.bind(this,"parseErrorCaseCause")}/>7. 案由分错<br/>
                      </p>
                    </div>
                    <div>
                      二 、模型结果错误
                      <p>
                        <Checkbox checked={checkError.predictErrorSimilarCases} onChange={this.changeCheck.bind(this,"predictErrorSimilarCases")}/>1. 类案错误<br/>
                        <Checkbox checked={checkError.predictErrorTooHigh} onChange={this.changeCheck.bind(this,"predictErrorTooHigh")}/>2. 预判偏重<br/>
                        <Checkbox checked={checkError.predictErrorTooLow} onChange={this.changeCheck.bind(this,"predictErrorTooLow")}/>3. 预判偏轻<br/>
                        <Checkbox checked={checkError.predictErrorRuleOverlay} onChange={this.changeCheck.bind(this,"predictErrorRuleOverlay")}/>4. 规则叠加<br/>
                      </p>
                    </div>
                    <div>
                      三 、数据异常
                      <p>
                        <Checkbox checked={checkError.dataErrorValue} onChange={this.changeCheck.bind(this,"dataErrorValue")}/>1. 文书数值错误<br/>
                        <Checkbox checked={checkError.dataErrorUnit} onChange={this.changeCheck.bind(this,"dataErrorUnit")}/>2. 单位错误<br/>
                        <Checkbox checked={checkError.dataErrorLessReason} onChange={this.changeCheck.bind(this,"dataErrorLessReason")}/>3. 说理不充分<br/>
                        <Checkbox checked={checkError.dataErrorUnusual} onChange={this.changeCheck.bind(this,"dataErrorUnusual")}/>4. 文书异常<br/>
                        <Checkbox checked={checkError.dataErrorPrisonTerm} onChange={this.changeCheck.bind(this,"dataErrorPrisonTerm")}/>5. 刑期错误<br/>
                        <Checkbox checked={checkError.dataErrorTime} onChange={this.changeCheck.bind(this,"dataErrorTime")}/>6. 时间错误<br/>
                        <Checkbox checked={checkError.dataErrorAmount} onChange={this.changeCheck.bind(this,"dataErrorAmount")}/>7. 金额错误<br/>
                      </p>
                    </div>
                    <div>
                      四 、文书复杂
                      <p>
                        <Checkbox checked={checkError.multiDefendant} onChange={this.changeCheck.bind(this,"multiDefendant")}/>1. 多被告<br/>
                        <Checkbox checked={checkError.multiCaseCause} onChange={this.changeCheck.bind(this,"multiCaseCause")}/>2. 多案由<br/>
                      </p>
                    </div>
                    <div>
                      其他错误描述： <Input
                      size="large"
                      placeholder="'具体错误信息'"
                      value={describe}

                    />
                    </div>
                    <div className="check_btn">
                      <Button type="primary" size="large" onClick={this.submit.bind(this, 0)}>
                        提交错误
                      </Button>
                      <Button type="primary" size="large" onClick={this.submit.bind(this, 1)}>
                        检查无误
                      </Button>
                    </div>
                  </div>
                  : null
              }
            </div>
            : null
        }
        <div className="nav_page">
          {
            !this.state.tabHidden ? <div>
              <span onClick={() => HashLocation.push('/')}>首页</span>
              /
              <span onClick={() => HashLocation.push(`/case_warning?id=${caseInfo.id}`)}>个案研究</span>
              /
              <span>案件详情</span>
            </div>:<div>
              <span>相似案件详情</span>
            </div>
          }
        </div>
        <div className="content_div ">
          <div className="left_div">
            <div className="title_div">
              <div className="title">
                {caseDetailMode ?
                (<span className="edit" style={{ cursor: 'pointer' }} onClick={this.saveCaseDetail}>
                  <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
                  <span style={{ color: '#21A0FF' }}>保存</span>
                </span>) : ''}
                <div className="title_name">
                  {caseInfo.name}
                  <a
                    rel="noopener noreferrer"
                    target="_blank" href={`http://180.96.11.68:6767/module/case_detail.html?id=${caseInfo.id}`}
                  >*</a>
                </div>
                <div className="title_detail">
                  <span>{caseInfo.docType === 7 ? '起诉时间' : '判决时间'}：
                    <span className="val">
                      {moment(caseInfo.decideTime).format('YYYY-MM-DD')}
                    </span>
                  </span>
                  <span>{caseInfo.docType === 7 ? '检察院' : '法院'}：
                    <span className="val">{caseInfo.courtName}</span>
                  </span>
                  {caseInfo.docType !== 7 ?
                    (<span>审理程序: <span className="val">
                      {caseInfo.docType === 7 ? caseInfo.gradeName : ''} {caseInfo.gradeName}
                    </span></span>) :
                    ''}
                  <span>案由：</span><span className="val">{this.searchChName(caseInfo.caseCauseId, caseCauses)}</span>
                  <span>案号：</span><span className="val">{caseInfo.caseNumber}</span>
                </div>
                <div className="navigate_div">
                  <div className="navigate"  id="youji" >
                    <div className="img" />
                    <span>目录</span><span>|</span>
                  </div>
                  <div className="para_navigate">
                    {paraTags.map(paraTag =>
                      <a key={paraTag.id} onClick={this.goAnchor.bind(this, paraTag.id)} >{paraTag.zhName}</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="law_title ">
              <div className="img icon_law" />
              <div>引用法规</div>
            </div>
            <div className="law_div">
              <div id="law-referenced">
                <div className="para_navigate">

                  {laws ? laws.map(law =>
                    <li className="" key={law.id}>
                      <div className="law_title">
                        <label><input type="radio" name="law" value={law.id} /></label>
                        <a>{law.name + law.item}</a>
                      </div>
                      <div className="law_info">
                        <div>
                          <span className="title">{law.name + law.item}</span>
                          <span className="content">{law.content}</span>
                        </div>
                      </div>
                    </li>
                  ):null}
                </div>
              </div>
            </div>
            <div className="essay_title ">
              <div className="img icon_article" /><div>文书正文</div>
            </div>
            <div className="essay_div" id="clear_click">
              <ul>
                {Object.keys(paraGroups).map(key =>
                  <li className="" key={key}>
                    {(() => {
                      if (tagMap[key] != null) {
                        return (
                          <div className="para_title"><div
                            id={tagMap[key].id}
                            className="title"
                          >
                            {tagMap[key].zhName}
                          </div>
                            {caseDetailMode ? <span className="edit">
                              <span>
                                {paraMap[key].editMode === 1 ?
                                  <img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /> :
                                  <img alt="aegis" src={require('../../assets/case_detail/bianji.png')} />
                              }
                              </span>
                              <span style={{ color: '#0594FF' }} onClick={this.toggleParaMode.bind(null, key)}>
                                {(paraMap[key].editMode && paraMap[key].editMode !== 'done') ? '保存' : '编辑'}
                              </span>
                            </span> : null}
                          </div>);
                      }
                      return null;
                    })()}
                    {(() => {
                      if (paraMap[key]&&!paraMap[key].editMode) {
                        return (paraGroups[key].map((para, index) => (<p className="para" key={index}>
                          {para.map(term => (
                            <span onContextMenu={this.alert.bind(this)}
                              word_id="term.id" id={term.id} key={`a${term.id}`} title={termMessages[term.id].tagName}
                              className={(() => {
                                let classname = '';
                                if (termMessages[term.id].sentenceHighLight) {
                                  classname += 'sentenceTag ';
                                }
                                if (termMessages[term.id].keywordHightLight) {
                                  classname += 'keyword ';
                                }
                                if (termMessages[term.id].wordHighLight) {
                                  classname += 'wordTag';
                                }
                                if(term.err){
                                  classname += 'light';
                                }
                                return classname;
                              })()}
                            >
                                <a onClick={this.showErrFunc.bind(this,term.id)}>{term.content}</a>
                              {
                                errPos.indexOf(term.id)!=-1 && term.showErr ?
                                  <span className="err_msg"><b onClick={this.showDialog.bind(this, term.id)}></b><a>{term.msg}</a></span>:null
                              }
                            </span>))}</p>)));
                      }
                      if (paraMap[key]&&paraMap[key].editMode === true) {
                        return (<p className="para">
                          <Input
                            type="textarea"
                            rows={6}
                            size="large"
                            placeholder="'请输入内容'"
                            value={paraMap[key].value}
                            onChange={this.handleParaValueChange.bind(this, key)}
                          />
                        </p>);
                      }
                      if (paraMap[key]&&paraMap[key].editMode === 'done') {
                        return (<p className="para">{paraMap[key].value}</p>);
                      }
                      return '';
                    })()}
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="right_div">
            {/* 基本信息 baseInfoForm*/}
            {!this.state.edit ?
              <div className="basic_info">
                <BasicInfo
                  baseInfoForm={baseInfoForm}
                  caseCauses={caseCauses}
                  toggleEditMode={this.toggleEditMode}
                  mode={caseDetailMode}
                />
              </div> : <div className="basic_info">
                <BasicInfoEdit
                  baseInfoForm={baseInfoForm}
                  caseCauses={caseCauses}
                  toggleMode={this.toggleMode}
                />
              </div>}
            {/* 当事人信息 partyInfoForm*/}
            {!this.state.partyEdit ?
              <BasicInfoParty
                mode={caseDetailMode}
                caseInfo={caseInfo}
                party={partyInfoForm} toggleEditMode={this.toggleEditMode}
              /> :
              <div className="basic_info">
                <BasicInfoPartyEdit
                  caseInfo={caseInfo}
                  toggleMode={this.toggleMode}
                  party={partyInfoForm}
                />
              </div>}
            {/* 事实标签 factInfoForm 前科信息*/}
            {!this.state.factEdit ?
              <BasicInfoFact
                mode={caseDetailMode}
                factInfoForm={factInfoForm}
                criminalRecords={caseInfo.records || []}
                caseCauses={caseCauses}
                toggleEditMode={this.toggleEditMode}
              /> : <div className="basic_info">
                <BasicInfoFactEdit
                  mode={caseDetailMode}
                  factInfoForm={factInfoForm}
                  criminalRecords={caseInfo.records || []}
                  caseCauses={caseCauses}
                  toggleMode={this.toggleMode}
                  handleFactTag={this.handleFactTag}
                /></div>
                }
            {/* 法律标签 lawTagForm*/}
            {(!this.state.lawEdit) ?
              <LawTag
                mode={caseDetailMode}
                lawTagForm={lawTagForm}
                lawMap={lawMap}
                toggleEditMode={this.toggleEditMode}
              /> :
              <LawTagEdit
                mode={caseDetailMode}
                lawTagForm={lawTagForm}
                handleLawTag={this.handleLawTag}
                toggleMode={this.toggleMode}
              />}
            {/* 判决结果 SentenceResultForm*/}
            {!this.state.resultEdit ?
              <SentenceResult
                mode={caseDetailMode}
                SentenceResultForm={SentenceResultForm}
                toggleEditMode={this.toggleEditMode}
              /> :
              <SentenceResultEdit
                mode={caseDetailMode}
                SentenceResultForm={SentenceResultForm}
                toggleMode={this.toggleMode}
              />}
          </div>
        </div>
      </div>
    );
  }
}
CaseDetail.propTypes = {
  caseDetail: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
  return {
    caseDetail: state.caseDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}
// export default CaseDetail;
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseDetail);
