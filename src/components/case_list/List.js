/**
 * Created by wuhao on 2017/3/25.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import { formatDate } from '../../utils/time-utils';

class List extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }
  componentDidMount = () => {
    console.log(this.props.deleteModel);
  };
  toDetail = (id) => {
    HashLocation.push(`/case_detail?id=${id}`);
  };
  showPredict = (id) => {
    // const root = `${window.location.hash.split('#')[0]}#`;
    // window.open(`${root}/?id=${id}`);
    this.$store.state.ids.push(id);
    HashLocation.push(`/case_warning?id=${id}`);
  };
  render = () => {
    const { deleteCase, chooseDelete, deleteCases, deleteModel, caseList } = this.props;
    return (<div className="case_list">
      {
        caseList.map((eachCase, index) => (<div className={this.$store.state.ids.indexOf(eachCase.case_info_id) !== -1 ? 'mark each_case' : 'each_case'} key={index} >
          {
            eachCase.case_info.docType === 7 ?
              <img className="icon_tag" src={require('../../assets/home/lawsuit_book.png')} /> : null
          }
          {(() => {
            if (eachCase.deviation_predict.judgement_term && eachCase.deviation_predict.judgement_term.deviation) {
              const val = Math.abs(eachCase.deviation_predict.judgement_term.deviation);
              if (val > 70) {
                return <img className="icon_tag" src={require('../../assets/home/level3.png')} />;
              } else if (val >= 50 && val < 70) {
                return <img className="icon_tag" src={require('../../assets/home/level2.png')} />;
              } else if (val >= 30 && val < 50) {
                return <img className="icon_tag" src={require('../../assets/home/level1.png')} />;
              }
            }
          })()}
          <div className="delete_case">
            <div className="delete" />
            <div className="delete_icon" title="'点击删除该案件'" onClick={deleteCase.bind(this, [eachCase.case_info_id])} />
          </div>
          {deleteModel ?
            <div
              className={deleteCases.indexOf(eachCase.case_info_id) !== -1 ? 'delete_check' +
                ' choosed' : 'delete_check'}
              onClick={chooseDelete.bind(this, eachCase.case_info_id)}
            /> : null}
          <div className="case_title_div">
            <div className="title" onClick={this.showPredict.bind(this, eachCase.case_info_id)} title={eachCase.case_info.name} style={this.$store.state.ids.indexOf(eachCase.case_info_id) !== -1 ? { color: '#999' } : {}}>{eachCase.case_info.name}
            </div>
            <div className="caseCause">{eachCase.case_info.caseCauseName}</div>
            {
              eachCase.case_info.errMsg[0] || eachCase.message[0] ?
                <div className="err_warning">
                  <a onClick={this.props.changeShowErr.bind(this, index)} className="hover_err" title="点击查看错误信息">文书内容有误 &nbsp;[ 查看 ]</a>
                  {
                      eachCase.case_info.showErr ?
                        <div className="red_msg">
                          <div className="ignore" onClick={this.props.changeShowErr.bind(this, index)}>忽略</div>
                          <div className="err_msg">
                            {
                              eachCase.case_info.errMsg[0] ? eachCase.case_info.errMsg.map(err => <p key={err.msg}>{err.msg}</p>) : null
                            }
                            {
                              eachCase.message[0] ? eachCase.message.map((err, index) => <p key={index}>{err}</p>) : null
                            }
                          </div>
                          <div className="btn" onClick={this.toDetail.bind(this, eachCase.case_info_id)}>
                            查看详情
                          </div>
                        </div> : null
                    }
                </div>
              : null
            }
          </div>
          <div className="case_body" onClick={this.showPredict.bind(this, eachCase.case_info_id)}>
            <div
              className="case_part judge_type"
              style={eachCase.case_info.upload_style}
            >
              {
                eachCase.case_info.docType !== 7 && eachCase.case_info.sentences ?
                  <p className="basic_msg">案例基本信息：
                    {(eachCase.deviation_predict.special_feature_decision_results || []).map(special =>
                      <span key={special.typeName} className="fact_tag">{special.typeName}: {special.num} {special.typeUnitName}</span>)}
                    {
                        eachCase.case_info.sentences[0] ?
                          <span>
                            {eachCase.case_info.sentences[0].detentionTerm ?
                              <span className="fact_tag">拘役 : {formatDate(eachCase.case_info.sentences[0].detentionTerm)} </span> : null}
                            {eachCase.case_info.sentences[0].control ?
                              <span className="fact_tag">管制 : {formatDate(eachCase.case_info.sentences[0].control)} </span> : null}
                            {eachCase.case_info.sentences[0].prisonTerm ?
                              <span className="fact_tag">有期徒刑 : {formatDate(eachCase.case_info.sentences[0].prisonTerm * 30)} </span> : null}
                            {eachCase.case_info.sentences[0].fine ?
                              <span className="fact_tag">罚金 : {eachCase.case_info.sentences[0].fine} </span> : null}
                            {eachCase.case_info.sentences[0].probationTime ?
                              <span className="fact_tag">缓刑 : {formatDate(eachCase.case_info.sentences[0].probationTime * 30)}</span> : null}
                            {eachCase.case_info.sentences[0].stripPoliticalRights ?
                              <span className="fact_tag">剥夺政治权利 : {eachCase.case_info.sentences[0].stripPoliticalRights}    年</span> : null}
                            {eachCase.case_info.sentences[0].confiscateProperty ?
                              <span className="fact_tag">没收全部个人财产</span> : null}
                          </span>
                          : null
                      }
                  </p>
                  :
                  <p className="basic_msg">案例基本信息：
                      {(eachCase.case_info.special_feature_decision_results || []).map(special =>
                        <span key={special.typeId}>{special.typeName}: {special.num} {special.typeUnitName}</span>)}
                  </p>
              }
              <div className="tags_div judge_type">
                {eachCase.case_info.tags.map(tag => <div key={tag.name} className="tag">{tag.zh_name}</div>) }
              </div>
              <div className="case_msg">
                <span>案号：{eachCase.case_info.caseNumber}</span>
                {
                  eachCase.case_info.docType === 7 ?
                    <span>
                      <span>法院：{eachCase.case_info.courtName}</span>
                      <span>起诉日期：{eachCase.case_info.decide_time}</span>
                    </span>
                  :
                    <span>
                      <span>检察院：{eachCase.case_info.prosecution}</span>
                      <span>判决日期：{eachCase.case_info.decide_time}</span>
                    </span>
                }
              </div>
            </div>
            {
              eachCase.case_info.docType !== 7 ?
                <div className="predict_part judge_type">
                  {eachCase.deviation_predict.total_degree !== 0 ? <div className="predict judge_type">
                    <div className="predict_value">
                      <span
                        className={
                      (() => {
                        let className = 'value';
                        if (eachCase.deviation_predict.total_degree > 80) {
                          className += ' black';
                        }
                        if (eachCase.deviation_predict.total_degree < 70) {
                          className += ' red';
                        }
                        return className;
                      })()}
                      > {eachCase.deviation_predict.total_degree}% </span>
                    </div>
                    <div className="predict_title">同判度</div>
                  </div> : null}
                  {
                    eachCase.deviation_predict.judgement_term.deviation !== null ?
                      <div className="predict judge_type">
                        <div className="predict_value">
                          <span
                            className={
                      (() => {
                        let className = 'value';
                        if (eachCase.deviation_predict.judgement_term.deviation > 50 || eachCase.deviation_predict.judgement_term.deviation < -50) {
                          className += ' red';
                        }
                        return className;
                      })()}
                          >{eachCase.deviation_predict.judgement_term.deviation}% </span>
                        </div>
                        <div className="predict_title">案件偏离度</div>
                      </div>
                      : null
                  }
                </div>
                : <div>
                  <div className="predict_part">
                    {
                      eachCase.deviation_predict.judgement_term.value ?
                        <div className="predict">
                          <div className="predict_value"><span className="value">{formatDate(eachCase.deviation_predict.judgement_term.value)}</span><span /></div>
                          <div className="predict_title">预测判期</div>
                        </div>
                        : null
                    }
                    {
                      eachCase.deviation_predict.fine.value ?
                        <div className="predict">
                          <div className="predict_value"><span className="value">{eachCase.deviation_predict.fine.value}</span><span>元</span></div>
                          <div className="predict_title">预测罚金</div>
                        </div>
                        : null
                    }
                    {
                      eachCase.deviation_predict.probation_term.value ?
                        <div className="predict">
                          <div className="predict_value"><span className="value">{formatDate(eachCase.deviation_predict.probation_term.value)}</span></div>
                          <div className="predict_title">预测缓刑</div>
                        </div>
                        : null
                    }
                  </div>
                </div>
            }
          </div>
        </div>))
      }
    </div>);
  }
}
List.propTypes = {
  caseList: React.PropTypes.array.isRequired,
  deleteModel: React.PropTypes.bool.isRequired,
  deleteCases: React.PropTypes.array.isRequired,
  chooseDelete: React.PropTypes.func.isRequired,
  deleteCase: React.PropTypes.func.isRequired,
  changeShowErr: React.PropTypes.func.isRequired
};
export default List;
