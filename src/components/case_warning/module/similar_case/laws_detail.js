/**
 * Created by Administrator on 2017/6/2.
 */

import React from 'react';
import Component from '../../../../constants/Component';
import { HashLocation } from 'react-router';
import '../../../../less/case_warning/law_detail.less'
class LawDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      law:{}
    };
    this.id = '';
    this.caseId = '';
  }

  componentDidMount = () => {
    const url = document.location.href;
    if (url.indexOf('?') !== -1) {
      const search = window.location.hash.split('?')[1];
      const id = search ? search.split('&')[0].split('=')[1] : '';
      const caseId = search ? search.split('&')[1].split('=')[1] : '';
      console.log(id, caseId);
      this.id = id;
      this.caseId = caseId;
      this.getLaw();
    }
  };
  getLaw = () => {
    this.$api.decision_result.get_red_book.request({id: this.id}).then((response) => {
      console.log(response);
      this.setState({law:response.data.data ? response.data.data : {}});
    });
  };
  render() {
    const {law} = this.state;
    return (
      <div>
        <div className="law_nav_page">
          <div>
            {/*<span onClick={() => HashLocation.push('/')}>首页</span>*/}
            {/*/*/}
            {/*<span onClick={() => HashLocation.push(`/case_warning?id=${this.caseId}`)}>个案研究</span>*/}
            {/*/*/}
            <span style={{marginLeft: '20px'}}>文章详情页</span>
          </div>
        </div>
        <div className="content_div">
          {
            law.title?<p id="law_detail_title">{law.title}</p>:null
          }
          {
            law.authors?<div id="law_detail_author">作者 ：  {law.authors}</div>:null
          }
          {
            law.content?<div id="law_content"><b>文章内容</b> ：<br/>{law.content}</div>:null
          }
        </div>
      </div>
    );
  }
}
LawDetail.propTypes = {

};
export default LawDetail;
