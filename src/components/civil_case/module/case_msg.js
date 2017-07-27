/**
 * Created by Administrator on 2017/6/12.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../../constants/Component';
import '../../../less/civil_case/civil_case.less';
import ReactEcharts from 'echarts-for-react';
import { formatDate } from '../../../utils/time-utils';

class CaseMsg extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  componentDidMount = () => {

  };
  render = () => (
    <div className="civil_case_msg">
      <p>案件信息</p>
      <div className="case_condition">
        <p>当前案件情况</p>
        <span>限制民事行为能力人</span><span>借款合同</span><span>合同有效</span>
      </div>
      <div className="civil_base_msg">
        <p>基本信息 <b>编辑 ></b></p>
        <div>诉讼主体</div>
        <span className="subject">男</span><span className="subject">高中生</span><span className="subject">15周岁</span><span className="subject">自然人</span>
        <div>基本事实</div>
        <span>不能完全辨认自己行为</span><span>朋友关系</span><span>涉案金额1万</span><span>有劳动能力</span><span>轻度精神迟滞</span>
        <div>法律关系</div>
        <span>民间借贷关系</span>
        <div>法律实体</div>
        <span>法定代理人</span><span>主体资格</span>
        <div>证据</div>
        <span>证据充分</span>
        <div className="civil_button">查看文书详情<b className="row" /></div>
      </div>
    </div>
  )
}
export default CaseMsg;
