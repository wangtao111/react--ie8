/**
 * Created by Administrator on 2017/4/17.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import '../../less/case_warning/box.less';
import PredictResult from './module/predict_result/predict_result';
import SimilarCase from './module/similar_case/similar_case';
import SimilarCaseSh from './module/similar_case/similar_case_sh';
import SimilarCaseXm from './module/similar_case/similar_case_xm';
import CaseInformation from './module/case_information/case_information';
import { formatDate } from '../../utils/time-utils';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      mapData: [],
      caseCauseMsg: {},
      sentences: {},
      caseInfo: {},
      result: {},
      totalDegree: 'null',
      similarCase: {},
      caseList: [],
      treeData: [],
      predictProperty: {},
      keys: [],
      caseInfoTags: [],
      caseCauseId: 0,
      similarLoading: true,
      echartsShow: true,
      total: 0,
      editParams: [],
      tagParams: [],
      type: 0,
      location: [],
      laws: [],
      laws_low:[],
      redBooks: [],
      redBooks_low: [],
    };
    this.main_punish_option = [// 主刑
      { id: 'prisonTerm', zh_name: '有期徒刑', value: '', UnitName: '个月' },
      { id: 'isLife', zh_name: '无期徒刑', value: '', UnitName: '' },
      { id: 'deathPenalty', zh_name: '死刑', value: '', UnitName: '' },
      { id: 'detentionTerm', zh_name: '拘役', value: '', UnitName: '天' },
      { id: 'control', zh_name: '管制', value: '', UnitName: '天' }
    ];
    this.timeOption = 10;
    this.similarOption = 50;
    this.partyName = '';
    this.provinceId = 0;
    this.provinceName = '';
  }

  componentDidMount = () => {
    if(localStorage.userMsg){
      this.userMsg = JSON.parse(localStorage.userMsg);
      this.$store.state.form.username = this.userMsg.username;
      this.provinceId = this.userMsg.province_id;
      this.provinceName = this.userMsg.province_name;
    }else{
      HashLocation.push('/')
    }
    this.getCaseInfo();
  }
  getCaseInfo = () => {
    const url = document.location.href;
    let param;
    this.$store.state.casePiece = false;
    if (url.indexOf('?') !== -1) {
      if(url.indexOf('&') !== -1){
        const search = window.location.hash.split('?')[1];
        const id = search ? search.split('&')[0].split('=')[1] : '';
        param = id ? id.split('#')[0] : '';
        this.$store.state.casePiece = true;
      }else{
        const search = window.location.hash.split('?')[1];
        const id = search ? search.split('=')[1] : '';
        param = id ? id.split('#')[0] : '';
      }
    }
    if(param){
      this.getAllMsg(param)
    }else{
      HashLocation.push('/case_upload');
    }
  };
  getAllMsg = (param) => {
    if (param) {
      this.$store.state.caseId = param;
      this.$api.decision_result.get_laws.request({ id: param }).then((response) => {
        console.log('法律适用',response.data);
        const laws = response.data.data.laws;
        const redBooks = response.data.data.redBooks;
        let book = [[],[]];
        let allLaws = [[],[]];
        if(redBooks.length){
          for(let i=0;i<redBooks.length;i++){
            if(redBooks[i].type){
              book[0].push(redBooks[i]);
            }else{
              book[1].push(redBooks[i]);
            }
          }
        }
        this.setState({redBooks:book[0]?book[0]:[]});
        this.setState({redBooks_low:book[1]?book[1]:[]});
        if (laws[0]) {
          for (let i = 0; i < laws.length; i += 1) {
            laws[i].show = false;
            if(laws[i].effective === 1){
              allLaws[0].push(laws[i]);
            }else{
              allLaws[1].push(laws[i]);
            }
          }
        }
        if(allLaws[0][0]){allLaws[0][0].show = true;}
        if(allLaws[1][0]){allLaws[1][0].show = true;}
        this.setState({laws: allLaws[0]?allLaws[0]:[]});
        this.setState({laws_low: allLaws[1]? allLaws[1]:[]})
      });
      Promise.all([
        this.$api.decision.caseInfo.request({ id: param }),
        this.$api.decision.inputValue.request({ caseId: param })
      ]).then((responses) => {
        const data = responses[0].data.data;
        console.log('案件信息', this.$api.decision.caseInfo, responses[0].data.data);
        if(data.province_id){this.provinceId = data.province_id};
        if(data.provinceName){this.provinceName = data.provinceName};
        if (!data.case_info) {
          data.case_info = {
            tags: [],
            laws: [],
            parties: [],
            agentReflects: [],
            lawIds: [],
            paras: [],
            causeParties: []
          };
        }
        if (!data.deviation_predict) {
          data.deviation_predict = {
            fine: {},
            probation_term: {},
            judgement_term: {}
          };
        }
        if(!data.case_info.sentences){
          data.case_info.sentences = [];
        }
        if(this.$store.state.casePiece){
          data.case_info.name = data.case_info.caseCauseName+'文书片段研判分析'
        }
        const caseInfoTags = data.case_info.tags;
        const tags = [];
        for (let i = 0; i < caseInfoTags.length; i += 1) {
          tags.push(caseInfoTags[i].name);
        }
        this.setState({ keys: tags });
        const sentences = data.case_info.sentences[0] ? data.case_info.sentences[0] : {};
        sentences.mainPunish = {};
        if (sentences.control) {
          sentences.mainPunish.value = sentences.control;
          sentences.mainPunish = this.main_punish_option[4];
          sentences.mainPunish.value = sentences.control;
          sentences.mainPunishTxt = formatDate(sentences.control);
        }
        if (sentences.detentionTerm) {
          sentences.mainPunish.value = sentences.detentionTerm;
          sentences.mainPunish = this.main_punish_option[3];
          if (sentences.detentionTerm / 30 > 6) {
            sentences.mainPunish.zh_name = '有期徒刑';
          } else {
            sentences.mainPunish.zh_name = '拘役';
          }
          sentences.mainPunish.value = sentences.detentionTerm;
          sentences.mainPunishTxt = formatDate(sentences.detentionTerm);
        }
        if (sentences.prisonTerm) {
          sentences.mainPunish = this.main_punish_option[0];
          sentences.mainPunish.value = sentences.prisonTerm;
          if (sentences.prisonTerm > 6) {
            sentences.mainPunish.zh_name = '有期徒刑';
          } else {
            sentences.mainPunish.zh_name = '拘役';
          }
          sentences.mainPunishTxt = formatDate(sentences.prisonTerm * 30);
        }
        if (sentences.isLife) {
          sentences.mainPunish = this.main_punish_option[1];
          sentences.mainPunish.value = 'null';
          sentences.mainPunishTxt = '无期徒刑';
        }
        if (sentences.deathPenalty) {
          sentences.mainPunish = this.main_punish_option[2];
          sentences.mainPunish.value = 'null';
          sentences.mainPunishTxt = '死刑';
        }
        const causeParties = data.case_info.causeParties;
        if(causeParties){
          if(causeParties[0]){
            this.setState({causeParties: causeParties[0].split(':')[1].split(',')});
            this.partyName = this.state.causeParties[0];
            console.log('多被告',this.state.partyName);
          }
        }
        this.setState({ caseInfo: data.case_info, sentences });
        this.setState({ caseInfoTags });
        this.setState({ caseCauseId: data.case_info.caseCauseId });
        this.$api.decision.caseCauseTags.request({ case_cause_id: this.state.caseCauseId }).then((response) => {
          this.setState({ treeData: response.data.data });
        });
        const data1 = responses[1].data.data;
        this.setState({
          caseCauseMsg: { selectTypes: data1.selectTypes, textTypes: data1.textTypes }
        });
        // 修改预测信息（result）
        if (this.state.caseInfo.caseCauseId) {
          // 修改相似案例（classCase）
          const similarForm = {time_option: 10, similar_option: 50 };
          if ( !similarForm.location_params ) {
            similarForm.location_params = {type:2, value: this.provinceId} ;
          }
          if(typeof(similarForm.location_params) === 'string'){
            similarForm.location_params = JSON.parse(similarForm.location_params);
          }
          similarForm.location_params = JSON.stringify(similarForm.location_params)
          this.getCaseList([], [], similarForm,1);
        }
      });
    }
  };
  getCaseList = (editParams, tagParams, similarForm,autoCheck) => {
    const caseInfoId = this.state.caseInfo.id;
    const caseCauseId = this.state.caseInfo.caseCauseId;
    const caseInfoTags = this.state.caseInfo.tags;
    const tags = [];
    for (let i = 0; i < caseInfoTags.length; i += 1) {
      tags.push(caseInfoTags[i].name);
    }
    this.setState({
      similarLoading: true
    });
    const params = {
      case_info_id: caseInfoId,
      username: this.$store.state.form.username,
      case_cause_id: caseCauseId,
      province_id: this.provinceId,
      edit_params: JSON.stringify(editParams),
      tag_params: JSON.stringify(tagParams),
      page:1,
      page_size:5,
      party_name: this.partyName,
      auto_check: autoCheck?autoCheck:0
    };
    Object.assign(params, similarForm);
    console.log("分页参数", params);
    this.$api.decision.getCaseList.request(params).then((response) => {

      this.setState({total :response.data.pager.total});
      console.log('分页数据',response);
      this.setState({ caseList: response.data.data });
      this.setState({ mapData: response.data.similar_case_judgement ? response.data.similar_case_judgement : [] });
      this.setState({ location: response.data.location_params});
      console.log("统计数据", this.state.mapData);
      similarForm.location_params = JSON.stringify(response.data.location_params);
      this.getSimilarCase(editParams, tagParams, similarForm);
      this.getResult(editParams, tagParams, similarForm);
    })
  }
  getResult = (editParams, tagParams, similarForm) => {
    const caseInfoId = this.state.caseInfo.id;
    const caseCauseId = this.state.caseInfo.caseCauseId;
    const caseInfoTags = this.state.caseInfo.tags;
    const tags = [];
    for (let i = 0; i < caseInfoTags.length; i += 1) {
      tags.push(caseInfoTags[i].name);
    }
    const params = {
      case_info_id: caseInfoId,
      username: this.$store.state.form.username,
      case_cause_id: caseCauseId,
      similar_option: 40,
      time_option: 0,
      province_id: this.provinceId,
      edit_params: JSON.stringify(editParams),
      tag_params: JSON.stringify(tagParams),
      party_name: this.partyName
    };
    Object.assign(params, similarForm);
    console.log('预测参数', params);
    this.$api.decision.newDeviation.request(params).then((response) => {
      this.setState({
        similarLoading: false
      });
       console.log('预测偏离度数据', response);
      const data = response.data.data;
      const result = data;
      this.setState({ result });
    });
  }
  getSimilarCase = (editParams, tagParams, similarForm) => {
    const caseInfoId = this.state.caseInfo.id;
    const caseCauseId = this.state.caseInfo.caseCauseId;
    const params = {
      case_info_id: caseInfoId,
      username: this.$store.state.form.username,
      case_cause_id: caseCauseId,
      province_id: this.provinceId,
      edit_params: JSON.stringify(editParams),
      tag_params: JSON.stringify(tagParams),
      party_name: this.partyName
    };
    Object.assign(params, similarForm);
    console.log("类案参数", params );
    this.$api.decision.newSimilar.request(params).then((response) => {
      console.log('类案数据', response);
      const data = response.data.data;
      const classCase = data;
      if (classCase.law_statistics[0]) {
        const n = classCase.law_statistics;
        for (let i = 0; i < n.length; i += 1) {
          classCase.law_statistics[i].show = false;
        }
        classCase.law_statistics[0].show = true;
      }
      const totalDegree = classCase.similar_degree.total_degree;
      this.setState({ totalDegree });
      this.setState({ similarCase: classCase });

    })
  }
  reload = (editParams, tagParams) => {
    console.log('改变的参数', editParams, tagParams);
    this.setState({editParams});
    this.setState({tagParams});
    if (editParams[0] || tagParams[0]) {
      // 修改相似案例（classCase）
      const similarForm = {time_option: 10, similar_option: 50 };
      this.getCaseList(editParams, tagParams, similarForm);
    }
  };
  changeForm = (similarForm) => {
    if (similarForm.location_params){
      if (similarForm.location_params.type === 0){
        similarForm.location_params.value = parseInt(this.state.caseInfo.courtId);
      }
      if (similarForm.location_params.type === 1){
        similarForm.location_params.value = parseInt(this.state.caseInfo.cityId);
      }
      if (similarForm.location_params.type === 2){
        similarForm.location_params.value = parseInt(this.state.caseInfo.provinceId);
      }
      if (similarForm.location_params.type === 3){
        similarForm.location_params.value = ''
      }
      if(typeof(similarForm.location_params) === 'string'){
        similarForm.location_params = JSON.parse(similarForm.location_params);
      }
      similarForm.location_params = JSON.stringify(similarForm.location_params)
    };
    this.getCaseList(this.state.editParams, this.state.tagParams, similarForm)
  }
  changeResult = (form) => {
    this.setState({sentences: form});
  };
  changeEchartsShow = (echartsShow) => {
    this.setState({echartsShow});
  };
  changeParty = (index) => {
    const sentences = this.state.caseInfo.sentences[index] ? this.state.caseInfo.sentences[index] : {};
    sentences.mainPunish = {};
    if (sentences.control) {
      sentences.mainPunish.value = sentences.control;
      sentences.mainPunish = this.main_punish_option[4];
      sentences.mainPunish.value = sentences.control;
      sentences.mainPunishTxt = formatDate(sentences.control);
    }
    if (sentences.detentionTerm) {
      sentences.mainPunish.value = sentences.detentionTerm;
      sentences.mainPunish = this.main_punish_option[3];
      if (sentences.detentionTerm / 30 > 6) {
        sentences.mainPunish.zh_name = '有期徒刑';
      } else {
        sentences.mainPunish.zh_name = '拘役';
      }
      sentences.mainPunish.value = sentences.detentionTerm;
      sentences.mainPunishTxt = formatDate(sentences.detentionTerm);
    }
    if (sentences.prisonTerm) {
      sentences.mainPunish = this.main_punish_option[0];
      sentences.mainPunish.value = sentences.prisonTerm;
      if (sentences.prisonTerm > 6) {
        sentences.mainPunish.zh_name = '有期徒刑';
      } else {
        sentences.mainPunish.zh_name = '拘役';
      }
      sentences.mainPunishTxt = formatDate(sentences.prisonTerm * 30);
    }
    this.setState({sentences});
    this.partyName = this.state.causeParties[index];
    this.getResult([],[]);
    this.setState({type:index});
    const similarForm = {time_option: 10, similar_option: 50 };
    if ( !similarForm.location_params ) {
      similarForm.location_params = {type: 1, value: parseInt(this.state.caseInfo.cityId)} ;
    }
    if(typeof(similarForm.location_params) === 'string'){
      similarForm.location_params = JSON.parse(similarForm.location_params);
    }
    similarForm.location_params = JSON.stringify(similarForm.location_params);
    this.getCaseList([], [], similarForm);
  };
  changeTags = (keys) => {
      this.$api.decision_result.get_tags.request({tagIds: JSON.stringify(keys)}).then((response) => {
        const data = response.data.data;
        for (let i = 0; i < data.length; i++ ) {
          data[i].name = data[i].id;
          data[i].zh_name = data[i].zhName;
          data[i].details_importance = data[i].importance
        }
        this.setState({caseInfoTags: data});
      });
  };
  changeCaseCauseMsg = (caseCauseMsg) => {
    this.setState({ caseCauseMsg });
  }
  render = () => (
    <div id="content">
      <div id="nav">
        <p>
          <span onClick={() => HashLocation.push('/case_list')}><a> 首页 </a></span>
          /
          <span> 个案研究</span>
          <b className="title">{this.state.caseInfo.name}</b>
        </p>
      </div>
      {
        this.state.causeParties && this.state.causeParties[1] ?
          <div className="parties">
            <ul>
              {
                this.state.causeParties.map((party,index) => {
                  return <li key={index} onClick={this.changeParty.bind(this, index)} className={this.state.type === index ? 'parties_hover' : ''}>{party}</li>
                })
              }
            </ul>
          </div>:null
      }

      <div id="case_warning">
        <div id="top_content">
          <PredictResult
            result={this.state.result}
            totalDegree={this.state.totalDegree}
            predictProperty={this.state.sentences}
            docType={this.state.caseInfo.docType}
            mapData={this.state.mapData}
            echartsShow={this.state.echartsShow}
            changeEchartsShow={this.changeEchartsShow.bind(this)}
            caseInfoId={this.state.caseInfo.id}
          />
        </div>
        <div id="bottom_content">
          <CaseInformation
            predictProperty={this.state.sentences}
            caseCauseMsg={this.state.caseCauseMsg}
            tags={this.state.caseInfoTags}
            treeData={this.state.treeData}
            selectTags={this.state.keys}
            reload={this.reload}
            caseInfoId={this.state.caseInfo.id || ''}
            caseCauseId={this.state.caseCauseId}
            changeEchartsShow={this.changeEchartsShow.bind(this)}
            changeResult={this.changeResult.bind(this)}
            changeTags={this.changeTags.bind(this)}
            changeCaseCauseMsg={this.changeCaseCauseMsg.bind(this)}
          />
          {(() => {
            if(this.$store.state.form.username === 'shjcy'){
              return <SimilarCaseSh
                similarCase={this.state.similarCase}
                tags={this.state.keys}
                changeForm={this.changeForm}
                loading={this.state.similarLoading}
                caseList={this.state.caseList}
                echartsShow={this.state.echartsShow}
                total={this.state.total}
                location={this.state.location}
                provinceName={this.provinceName}
                lawStatistics={this.state.laws}
                laws_low={this.state.laws_low}
                redBooks={this.state.redBooks}
                redBooks_low={this.state.redBooks_low}
              />
            }
            if(this.$store.state.form.username === 'xmzy'){
              return <SimilarCaseXm
                similarCase={this.state.similarCase}
                tags={this.state.keys}
                changeForm={this.changeForm}
                loading={this.state.similarLoading}
                caseList={this.state.caseList}
                echartsShow={this.state.echartsShow}
                total={this.state.total}
                location={this.state.location}
                provinceName={this.provinceName}
                lawStatistics={this.state.laws}
                laws_low={this.state.laws_low}
                redBooks={this.state.redBooks}
                redBooks_low={this.state.redBooks_low}
              />
            }else{
              return <SimilarCase
                similarCase={this.state.similarCase}
                tags={this.state.keys}
                changeForm={this.changeForm}
                loading={this.state.similarLoading}
                caseList={this.state.caseList}
                echartsShow={this.state.echartsShow}
                total={this.state.total}
                location={this.state.location}
                provinceName={this.provinceName}
                lawStatistics={this.state.laws}
                laws_low={this.state.laws_low}
                redBooks={this.state.redBooks}
                redBooks_low={this.state.redBooks_low}
              />
            }
          })()}
        </div>
      </div>
    </div>
  )
}
export default Home;
