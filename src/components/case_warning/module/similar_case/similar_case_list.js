/**
 * Created by Administrator on 2017/4/18.
 */

import React from 'react';
import { Pagination } from 'antd';
import '../../../../less/case_warning/similar_case.less';
import Component from '../../../../constants/Component';
import { formatDate } from '../../../../utils/time-utils';

class SimilarCaseList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount = () => {

  };

  toDetail = (id) => {
    const root = `${window.location.hash.split('#')[0]}#`;
    window.open(`${root}/case_detail?id=${id}&similar_case`);
    localStorage.caseDetailMode=false;
  };

  render() {
    const { caseList, tags, changeForm } = this.props;
    return (<div className="pane" style={{marginBottom: '50px'}}>
      {caseList[0] ? caseList.map(
          detail => <div className="case" key={detail.id} onClick={this.toDetail.bind(this,detail.id)}>
            <div>
              <p className="case_head"><b>{detail.name}</b>
                <span className="similarity">案例相似度: {parseInt(
                  detail.similarity * 100, 10)}%</span>
              </p>
              <p className="classCaseMsg">案例基本信息：
                {detail.special_feature_decision_results.map(
                  special =>
                    <i key={special.typeName}>{special.typeName}
                      : {special.num} {special.typeUnitName}</i>)
                }
                {detail.sentences&&detail.sentences[0]&&detail.sentences[0].detentionTerm ? <i>拘役 : {formatDate(
                  detail.sentences[0].detentionTerm)} </i>
                  : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].control ?
                    <i>管制 : {formatDate(detail.sentences[0].control)} </i>
                    : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].prisonTerm ? <i>有期徒刑 : {formatDate(
                    detail.sentences[0].prisonTerm * 30)}</i>
                    : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].fine ?
                    <i>罚金 : {detail.sentences[0].fine}</i>
                    : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].probationTime ? <i>缓刑 : {formatDate(
                    detail.sentences[0].probationTime * 30)}</i>
                    : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].stripPoliticalRights ?
                    <i>剥夺政治权利 : {detail.sentences[0].stripPoliticalRights}
                      年</i>
                    : ''
                }
                {
                  detail.sentences&&detail.sentences[0]&&detail.sentences[0].confiscateProperty ? <i>没收全部个人财产</i>
                    : ''
                }
              </p>
              <div>
                {
                  detail.tags.map(tag => ( tag.details_importance === 1 && tags.indexOf(tag.name) !== -1 ?
                    <span key={tag.zh_name} className="tag case_importance">{tag.zh_name}</span>
                    : null))
                }
                {
                  detail.tags.map(tag => ( tag.details_importance === 1 && tags.indexOf(tag.name) === -1 ?
                    <span key={tag.zh_name} className="tag case_importance">{tag.zh_name}</span>
                    : null))
                }
                {
                  detail.tags.map(tag => ( tag.details_importance !== 1 && tags.indexOf(tag.name) !== -1 ?
                    <span key={tag.zh_name} className="tag" style={{ background: '#d2ecff',color:'#213f56',border:'1px solid #91d0ff'}}>{tag.zh_name}</span>
                    : null))
                }
                {
                  detail.tags.map(tag => ( tag.details_importance !== 1 && tags.indexOf(tag.name) === -1 ?
                    <span key={tag.zh_name} className="tag" style={{ background: '#fff' }}>{tag.zh_name}</span>
                    : null))
                }
              </div>
              <p className="case_foot">
                <b className="case_foot_item">案号 : {detail.case_number} </b>
                <b className="case_foot_item">法院 : {detail.court_name}</b>
                <b className="case_foot_item">法官 : {detail.court_name}</b>
                <b className="case_foot_item">日期 : {detail.decide_time}</b>
              </p>
            </div>
          </div>): <div className="predict_pane"></div>
      }
    </div>);
  }
}
SimilarCaseList.propTypes = {
  caseList: React.PropTypes.array.isRequired,
  tags: React.PropTypes.array.isRequired,
  changeForm: React.PropTypes.func.isRequired
};
export default SimilarCaseList;
