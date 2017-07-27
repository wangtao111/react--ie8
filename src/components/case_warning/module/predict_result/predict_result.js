/**
 * Created by Administrator on 2017/4/18.
 */
import React from 'react';
import ReactDom from 'react-dom';
import { Modal } from 'antd';
import 'antd/lib/index.css';
import '../../../../less/case_warning/predict_result.less';
import Component from '../../../../constants/Component';
import { formatDate } from '../../../../utils/time-utils';
import Deviation from './deviation';
import Analysis from './analysis';
import AnalysisBig from './Banalysis';

class PredictResult extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      predictProperty: {},
      mainPunishValue: '',
      predict_level: 0
    };
    this.totalDegree = 0;
  }
  componentWillReceiveProps = (nextProps) => {
    const predictProperty = nextProps.predictProperty;
    this.totalDegree = nextProps.predictProperty;
    if(predictProperty.mainPunish){
      if (predictProperty.mainPunish.id === 'prisonTerm'){
        this.setState({mainPunishValue: predictProperty.mainPunish.value * 30});
      }else{
        this.setState({mainPunishValue: predictProperty.mainPunish.value});
      }
    }
    if(nextProps.result){
      if(nextProps.result.judgement_term){
        if(nextProps.result.judgement_term.deviation !== 'null'){
          if(Math.abs(nextProps.result.judgement_term.deviation)>=30&&Math.abs(nextProps.result.judgement_term.deviation)<50){
            this.setState({ predict_level: 1 });
          }else if (Math.abs(nextProps.result.judgement_term.deviation)>=50&&Math.abs(nextProps.result.judgement_term.deviation)<=70){
            this.setState({ predict_level: 2 });
          }else if(Math.abs(nextProps.result.judgement_term.deviation)>70){
            this.setState({ predict_level: 3 });
          }
        }
      }
    }
  }
  componentDidMount = () => {
    //this.canvasDraw(this.props.totalDegree*100);
  };
  showModal() {
    this.setState({
      visible: true
    });
    this.props.changeEchartsShow(false);
  };
  handleOk() {
    this.setState({
      visible: false
    });
    this.props.changeEchartsShow(true);
  };
  handleCancel() {
    this.setState({
      visible: false
    });
    this.props.changeEchartsShow(true);
  };
  canvasDraw = (x) => {
    var n = 0;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.canvas.width = 50;
    ctx.canvas.height = 50;
    var time = setInterval(function(){
        if(n<=x){
          ctx.clearRect(0,0,50,50);
          ctx.beginPath();
          //设置当前线条的宽度
          ctx.lineWidth = 2; //10px
          //设置笔触的颜色
          ctx.strokeStyle = '#ccc';
          //arc() 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(30, 30, 10, 0, 2 * Math.PI);
          //绘制已定义的路径
          ctx.stroke();
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#f30';
          //设置开始处为0点钟方向(-90 * Math.PI / 180)
          //x为百分比值(0-100)
          ctx.arc(30, 30, 10, -90 * Math.PI / 180, (n * 3.6 - 90) * Math.PI / 180);
          ctx.stroke();
        }else{
          clearInterval(time);
        }
        n++;
      },20)
  };

  render() {
    const { result, totalDegree, predictProperty, mapData, docType, caseInfoId  } = this.props;
    const { mainPunishValue, predict_level } = this.state;
    return (
      <div className="result">
        <div className="box_d_s">
          <div className="charts_title">
            <i/> 综合预警等级
            {
              predict_level ?
                <div>
                  <i style={ predict_level === 1 ? {color:'#5BB1F0'} : predict_level === 2 ? {color: '#EBB533'} : {color:'#DB3C3F'} }>{predict_level}级</i>
                  <div className="info">
                    <div className="law_info">
                      <div>
                        <span>综合预警等级设定标准</span>
                        <ul>
                          <li className="leve3"><b>3级</b> 您的判罚与综合预测结果存在较大偏差</li>
                          <li className="leve2"><b>2级</b> 您的判罚与综合预测结果存在轻微偏差</li>
                          <li className="leve1"><b>1级</b> 判罚与综合预测结果预测接近一致</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>:null
            }
          </div>
          <div className="deviation">
            {result.judgement_term ?
              <div>
                <p>偏离度 :
                  {
                    result.judgement_term.deviation !== null ?
                      <span
                        className="bond" style={result.judgement_term.deviation <= 50 && result.judgement_term.deviation >= -50 ?
                        { color: '#5BB1F0' } : { color: '#D87B81' }}
                      >
                      {result.judgement_term.deviation === 'null' ? '--' : result.judgement_term.deviation} %
                    </span>
                      :  <span>
                      -- --
                    </span>
                  }
                </p>
                <div id="deviation_chart">
                  {
                   result.judgement_term.deviation !=='null' && this.props.echartsShow ? <Deviation
                     dashboard={{ total: result.judgement_term.deviation, min: -100, max: 100, color: ['#D87B81', '#5BB1F0', '#D87B81'] }}
                   /> : null
                   }
                </div>
              </div>
                : null}
            {result.total_deviation === 'null' && result.total_deviation == null ?
              <div>
                <p>综合偏离度:</p>
                <b className="predict_model" />
              </div>
                : null}
          </div>
            <div className="total_degree">
              <div>
              </div>
              <p>同判度：
                {
                  totalDegree !== 'null' && totalDegree !== 0 ?
                    <span className="bond" style={ totalDegree <= 20 && totalDegree >= 0 ?
                    { color: '#5BB1F0' } : totalDegree > 20 && totalDegree < 80 ? { color: '#2dc7c9' } : { color: '#D87B81' } } >
                  {parseInt(totalDegree * 100, 10)} %
                </span>:"-- --"
                }
              </p>
            </div>
        </div>
        <div className="result_box">
          <p className="result_box_title">
            <i onClick={() => {window.open(`http://10.131.50.152:7777/regular/check?id=${caseInfoId}`)}}></i> 判罚统计对比
          </p>
          <div className="result_table">
            <table>
              <thead>
                <tr>
                  <th>{docType === 7 ? '量刑建议判罚' : '当前判罚'}</th>
                  <th>预测判罚</th>
                  <th>偏离预警</th>
                </tr>
              </thead>
              <tbody>
                <tr className="main_msg">
                  <td>
                    {
                      predictProperty.mainPunish?
                        <i>{ predictProperty.mainPunish.value ? `${predictProperty.mainPunish.zh_name}` : ''}<br/>
                          { predictProperty.mainPunish.value ? formatDate(mainPunishValue) : '-- --'}</i>
                        : <i><br/>-- --</i>
                    }
                  </td>
                  <td>
                    {
                      result.judgement_term && result.judgement_term.value ?
                        <i>
                          {result.judgement_term.value/30 > 6 ? '有期徒刑 ' : '拘役 '} <br/>
                          {result.judgement_term.name === '拘役' ?
                            formatDate(result.judgement_term.value ) :
                            formatDate(result.judgement_term.value )}</i>
                        : <i><br/>-- --</i>
                    }
                  </td>
                  <td>
                    { result.judgement_term && docType !==7  ?
                      <div>
                        {
                          result.judgement_term.deviation >= 50 || result.judgement_term.deviation < -50 ?
                            <img src={require("../../../../assets/case_warning/yujing.png")} /> : null
                        }
                      </div>
                      : null
                    }
                  </td>
                </tr>
                <tr className="fine_msg">
                  <td>
                    <i>罚金 <br/> {predictProperty.fine ? `${predictProperty.fine} 元` : '-- --'}</i>
                  </td>
                  <td>
                    <i>罚金<br/> {(result.fine && result.fine.value) ? `${result.fine.value}元` : '--' +
                      ' --'} </i>
                  </td>
                  <td>
                    {
                      result.fine && docType !==7  ?
                        <div>
                          {
                            result.fine.deviation >= 60 || result.fine.deviation <= -60 ?
                            <img src={ require("../../../../assets/case_warning/yujing.png") } /> : null
                          }
                        </div>
                        : null
                    }
                  </td>
                </tr>
                <tr className="probation_msg">
                  <td>
                    <i>缓刑  <br/>{predictProperty.probationTime ? formatDate(predictProperty.probationTime * 30) : '--' +
                      ' --'} </i>
                  </td>
                  <td>
                    <i>
                      缓刑  <br/>{(result.probation_term && result.probation_term.value) ? formatDate(result.probation_term.value) : '-- --'}
                    </i>
                  </td>
                  <td>
                    {
                      result.probation_term && docType !==7 ?
                        <div>
                          {
                            result.probation_term.deviation > 50 || result.probation_term.deviation < -50 ?
                              <img src={require("../../../../assets/case_warning/yujing.png")} /> : null
                          }
                        </div>
                        : null
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="predict_map">
          <p className="map_title"></p>
          <div className="big_map_show" onClick={this.showModal.bind(this)}>
            <span>查看大图</span>
            <b />
          </div>

          {mapData.length && this.props.echartsShow ? <Analysis
            mapData={mapData}
            predictProperty={predictProperty}
            chartStyle={{ width: '350px', height: '260px' }}
          /> : null}
          <Modal
            visible={this.state.visible} width={900}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            style={{ height: 500 }}
          >
            {mapData.length? <AnalysisBig
              mapData={mapData}
              predictProperty={predictProperty}
              chartStyle={{ width: '800px', height: '500px' }}
            /> : null}
          </Modal>
        </div>
      </div>
    );
  }
}
PredictResult.propTypes = {
  result: React.PropTypes.object.isRequired,
  predictProperty: React.PropTypes.object.isRequired,
  mapData: React.PropTypes.array.isRequired,
  totalDegree: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired
};
export default PredictResult;
