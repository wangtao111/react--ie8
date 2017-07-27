/**
 * Created by Administrator on 2017/6/12.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../../constants/Component';
import '../../../less/civil_case/civil_case.less';
import ReactEcharts from 'echarts-for-react';
import { formatDate } from '../../../utils/time-utils';

class ArgueFactPoint extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tags: [
        { imp: 1, name: '转账凭证' },
        { imp: 1, name: '鉴定意见' },
        { imp: 1, name: '未提供零花钱' },
        { imp: 0, name: '借条' },
        { imp: 0, name: '借款协议' },
        { imp: 0, name: '收款凭证' },
        { imp: 0, name: '借款用途的证明' },
        { imp: 0, name: '付款付息凭证' }
      ]

    };
  }
  componentDidMount = () => {
    const tags = this.state.tags;
    for (let i = 0; i < tags.length; i++) {
      tags[i].show = true;
    }
    this.setState({ tags });
  };
  showChooseTag = (index) => {
    const tags = this.state.tags;
    tags[index].show = !tags[index].show;
    this.setState({ tags });
  }
  render = () => (
    <div className="evidence">
      <p>证据模块</p>
      <ul>
        {
          this.state.tags.map((tag, index) => (
            <li onClick={this.showChooseTag.bind(this, index)} className={tag.imp ? 'tag_imp' : ''} key={index}>
              {tag.name}{tag.show ? <b/> : null }</li>))
        }
      </ul>
    </div>
  )
}
export default ArgueFactPoint;
