/**
 * Created by Administrator on 2017/6/9.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import '../../less/civil_case/civil_case.less';
import ReactEcharts from 'echarts-for-react';
import { formatDate } from '../../utils/time-utils';
import CaseMsg from './module/case_msg';
import ArgueFactPoint from './module/argue_fact_point';
import Evidence from './module/Evidence';
import SimilarCase from './module/similar_case/similar_case';

class CivilCase extends Component {
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
      laws_low: [],
      redBooks: [],
      redBooks_low: [],
      leftArrShow: false,
      rightArrShow: true
    };
    this.cardLeft = 0;
  }
  componentDidMount = () => {

  };
  goAnchor = (range) => {
    if( range === 'left' ) {

    }
    const element = document.getElementById('slide');
    let n = this.cardLeft;
    const l = setInterval(() => {
      if (n >= this.cardLeft - 300) {
        element.style.left = `${n}px`;
      } else {
        clearInterval(l);
      }
      n -= 5;
    }, 1);
    this.cardLeft -= 300;
  };
  render = () => {
    const { rightArrShow, leftArrShow } = this.state;
    return (<div id="civil_app">
      <div className="civil_nav">
        <p>
          <span><a> 列表页 </a></span>
          /
          <span> 个案研究</span>
          <b className="title">王某诉讼朱某民间借贷纠纷一审民事判决书</b>
        </p>
      </div>
      <div className="civil_cart">
        <div>
          {
            leftArrShow ? <div className="left_arr" onClick={this.goAnchor.bind(this, 'left')}><b></b></div> : null
          }
          {
            rightArrShow ? <div className="right_arr" onClick={this.goAnchor.bind(this, 'right')}><b></b></div> : null
          }
          <ul id="slide">
            <li id="a1">
              限制民事行为能力人的借款效力 <img src={require('../../assets/civil_case/warning.png')} alt="预警" /></li>
            <li>借条存在瑕疵导致当事人对借款数额有争议</li>
            <li>微信转账的借贷行为效力</li>
            <li>涉嫌犯罪的民间借贷合同效力</li>
            <li>涉嫌犯罪的民间借贷合同效力</li>
            <li>涉嫌犯罪的民间借贷合同效力</li>
          </ul>
        </div>
      </div>
      <div id="civil_case">
        <CaseMsg />
        <div className="argue_fact_content">
          <ArgueFactPoint />
          <Evidence />
          <div className="civil_similar_case">
            <SimilarCase
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
          </div>
        </div>
      </div>
    </div>);
  }
}
export default CivilCase;
