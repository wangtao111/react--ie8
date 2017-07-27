/**
 * Created by Administrator on 2017/4/18.
 */

import React from 'react';
import Component from '../../../../constants/Component';

class LawStatistics extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      lawStatistics: [],
      laws_low: [],
      paneType: 1
    };
  }
  componentWillReceiveProps = (nextProps) => {

  };
  componentDidMount = () => {
    if(this.props.laws_low[0]){
      this.setState({paneType: 2});
    }
    if(this.props.lawStatistics[0]){
      this.setState({paneType: 1});
    }
    if(this.props.redBooks[0]){
      console.log(333333);
      this.setState({paneType: 3});
    }
    if(this.props.redBooks_low[0]){
      this.setState({paneType: 4});
    }
  };
  changeLawStatisticsActive = (lawStatistics, index) => {
    if (lawStatistics) {
      lawStatistics[index].show = !lawStatistics[index].show;
      this.setState({ lawStatistics });
    }
  };
  changeLawLowActive = (laws_low, index) => {
    if (laws_low) {
      laws_low[index].show = !laws_low[index].show;
      this.setState({ laws_low });
    }
  };
  toLawDetail = (id) => {
    const root = `${window.location.hash.split('#')[0]}#`;
    window.open(`${root}/law_detail?id=${id}&case_id=${this.$store.state.caseId}`);
  }
  render() {
    const { lawStatistics, laws_low, redBooks, redBooks_low } = this.props;
    const { paneType } = this.state;
    return (
      <div className="pane">
        <ul className="law_pane_title">
          <li className={this.state.paneType === 1 ? 'law_pane_active' : ''} onClick={() => {this.setState({paneType: 1})}}>
            刑法规定</li>
          <li className={this.state.paneType === 2 ? 'law_pane_active' : ''} onClick={() => {this.setState({paneType: 2})}}>
            司法解释</li>
          <li className={this.state.paneType === 3 ? 'law_pane_active' : ''} onClick={() => {this.setState({paneType: 3})}}>
            本市规定</li>
          <li className={this.state.paneType === 4 ? 'law_pane_active' : ''} onClick={() => {this.setState({paneType: 4})}}>
            理解与适用</li>
        </ul>
        {
          paneType === 1 ?
            <div className="law-applicable">
              {lawStatistics[0] ? (lawStatistics || []).map(
                (lawItem, index) =>
                  <div className="item" key={index}>
                    <div className="order-number">{index + 1}、</div>
                    <div
                      className="title" title={lawItem.name} onClick={this.changeLawStatisticsActive.bind(
                      this, lawStatistics, index)}
                    ><b className="case_cause_title">{lawItem.caseCauseName}</b>{lawItem.name}</div>
                    {/*<div className="bar-wrapper">*/}
                    {/*<div className="bar" style={{ width: `${provision.percent}%` }} />*/}
                    {/*<div className="percent">{provision.percent}</div>*/}
                    {/*</div>*/}
                    {/*<div className="count">引用<span>{provision.count}</span>次</div>*/}
                    {lawStatistics[index].show ? <div className="item-content">
                      {/*<span className="explain">释义：</span>*/}
                      <span style={{color: '#136BA8', fontSize: '16px'}}>【{lawItem.item}】</span>&nbsp;
                      {lawItem.content}
                    </div> : null}
                  </div>) : null}
              {!lawStatistics[0] ? <div className="predict_pane"></div> : null}
            </div>
            :null
        }
        {
          paneType === 2 ?
            <div className="law-applicable">
              {laws_low[0] ? (laws_low || []).map(
                (law, index) =>
                  <div className="item" key={index}>
                    <div className="order-number">{index + 1}、</div>
                    <div
                      className="title" title={law.name} onClick={this.changeLawLowActive.bind(
                      this, laws_low, index)}
                    ><b className="case_cause_title">{law.caseCauseName}</b>{law.name}</div>
                    {/*<div className="bar-wrapper">*/}
                    {/*<div className="bar" style={{ width: `${provision.percent}%` }} />*/}
                    {/*<div className="percent">{provision.percent}</div>*/}
                    {/*</div>*/}
                    {/*<div className="count">引用<span>{provision.count}</span>次</div>*/}
                    {laws_low[index].show ? <div className="item-content">
                      <span style={{color: '#136BA8', fontSize: '16px'}}>【{law.item}】</span>&nbsp;
                      {/*<span className="explain">释义：</span>*/}
                      {law.content}
                    </div> : null}
                  </div>) : null}
              {!laws_low[0] ? <div className="predict_pane"></div> : null}
            </div>
            :null
        }
        {
          paneType === 3 ?
            <div className="law_pane">
              {
                redBooks.map((law, index) => {
                  return law.type !== 0 ?<div key={index}>
                    <i>{index+1}、</i>
                    <p className="law_title">{law.title}</p>
                    <ul className="author">
                      <li>作者 : {law.authors}</li>
                    </ul>
                    <div className="law_content">
                      {law.content}
                    </div>
                    <div className="look_detail" onClick={this.toLawDetail.bind(this, law.id)}>
                      查看详情 >
                    </div>
                  </div>:null
                })
              }
              {!redBooks[0] ? <div className="predict_pane"></div> : null}
            </div>
            :null
        }
        {
          paneType === 4 ?
            <div className="law_pane">
                {
                  redBooks_low.map((law, index) => {
                    return law.type === 0 ?<div key={index}>
                        <i>{index+1}、</i>
                        <p className="law_title">{law.title}</p>
                        <ul className="author">
                          <li>作者 : {law.authors}</li>
                        </ul>
                        <div className="law_content">
                          {law.content}
                        </div>
                        <div className="look_detail"  onClick={this.toLawDetail.bind(this, law.id)}>
                          查看详情 >
                        </div>
                      </div>:null
                  })
                }
              {!redBooks_low[0] ? <div className="predict_pane"></div> : null}
            </div>
            :null
        }
      </div>
    );
  }
}
LawStatistics.propTypes = {
  lawStatistics: React.PropTypes.array.isRequired
};
export default LawStatistics;
