/**
 * Created by hui on 2017/3/31.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import Component from '../../../../constants/Component';
import { formatDate } from '../../../../utils/time-utils';
import "../../../../less/case_warning/Banalysis.less"

class Analysis extends Component {
  constructor(props, context) {
    super(props, context);
    this.mainShow = true;
    this.fineShow = true;
    this.probationShow = true;
    this.state = {
      analysisType: 0
    };
  }
  componentWillReceiveProps = (nextProps) => {
    nextProps.mapData[0][0] ? this.mainShow = true : this.mainShow = false;
    nextProps.mapData[1][0] ? this.fineShow = true : this.fineShow = false;
    nextProps.mapData[2][0] ? this.probationShow = true : this.probationShow = false;
  };
  componentWillMount = () => {
    this.props.mapData[0][0] ? this.mainShow = true : this.mainShow = false;
    this.props.mapData[1][0] ? this.fineShow = true : this.fineShow = false;
    this.props.mapData[2][0] ? this.probationShow = true : this.probationShow = false;
  }
  getOption = () => {
    let option = {};
    let seriesData = [];
    let xName = '';
    let xData = [];
    let yName = '';
    const yData = [];
    let xUnit = '';
    let yUnit = '';
    let markX = '';
    let markY = '';
    let markValue = '';
    if (this.props.mapData[0]) {
      if (!this.state.analysisType) {
        if (this.props.mapData[0][0]) {
          this.mainShow = true;
          seriesData = this.props.mapData[0][1];
          xData = this.props.mapData[0][0];
          for (let n = 0; n < seriesData.length; n += 1) {
            yData.push(seriesData[n].value);
          }
          let punish = '';
          if (this.props.predictProperty.prisonTerm) {
            punish = this.props.predictProperty.prisonTerm;
          } else if (this.props.predictProperty.detentionTerm) {
            punish = this.props.predictProperty.detentionTerm / 30;
          }
          for (let i = 0; i < xData.length; i += 1) {
            if (punish === parseInt(xData[i], 10)) {
              markX = parseInt(xData[i], 10) - parseInt(xData[0], 10);
              markValue = formatDate(parseInt(xData[i], 10) * 30);
              markY = seriesData[i].value;
            }
          }
          xName = '刑期';
          yName = '案件个数';
          xUnit = '个月';
          yUnit = '个';
          option = this.analysis(seriesData, xName, xData, yName, yData, xUnit, yUnit, '#ff7e3f', '刑期', 'line', false, markX, markY, markValue, 20, '');

          return option;
        }
      } else if (this.state.analysisType === 1) {
        if (this.props.mapData[1][0]) {
          this.fineShow = true;
          seriesData = this.props.mapData[1][1];
          xData = this.props.mapData[1][0];
          for (let n = 0; n < seriesData.length; n += 1) {
            yData.push(seriesData[n].value);
          }
          const list = [];
          for (let i = 0; i < xData.length; i += 1) {
            list[i] = xData[i].split('-');
            if (this.props.predictProperty.fine >= list[i][0] && this.props.predictProperty.fine <= list[i][1]) {
              markX = `${list[i][0]}-${list[i][1]}`;
              markY = seriesData[i].value;
            }
          }
          xName = '罚金';
          yName = '案件个数';
          xUnit = '元';
          yUnit = '个';
          option = this.analysis(seriesData, xName, xData, yName, yData, xUnit, yUnit, '#2dc7c9', '罚金', 'line', false, markX, markY, markX, 20, '元');
          return option;
        }
      } else {
        if (this.props.mapData[2][0]) {
          this.probationShow = true;
          seriesData = this.props.mapData[2][1];
          xData = this.props.mapData[2][0];
          for (let n = 0; n < seriesData.length; n += 1) {
            yData.push(seriesData[n].value);
          }
          for (let i = 0; i < xData.length; i += 1) {
            if (this.props.predictProperty.probationTime === parseInt(xData[i], 10)) {
              markX = parseInt(xData[i], 10) - parseInt(xData[0], 10);
              const n = parseInt(xData[i], 10);
              markValue = formatDate(n * 30);
              markY = seriesData[i].value;
            }
          }
          xName = '缓刑';
          yName = '案件个数';
          xUnit = '个月';
          yUnit = '个';
          option = this.analysis(seriesData, xName, xData, yName, yData, xUnit, yUnit, '#5bb1ef', '缓刑', 'line', false, markX, markY, markValue, 20, '');
          return option;
        }
      }
    }
    return {};
  }
  changeAnalysisType = (val) => {
    this.setState({ analysisType: val });
  }

  analysis = (seriesData, xName, xData, yName, yData, xUnit, yUnit, color, title, type, showTool, markX, markY, markValue, symbolSize, markUnit) => {
    // 绘制图表
    let option = {};
    option = {
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          return `${xName} : ${params[0].name}${xUnit}<br/>` +
            ` ${yName} : ${params[0].data.value}<br/>` +
            `占比 : ${params[0].data.ratio}`;
        }
      },
      toolbox: {
        right: 30,
        feature: {
          magicType: { show: showTool, type: ['line', 'bar'] },
          restore: { show: showTool },
          saveAsImage: { show: showTool },
          mark: { show: showTool },
          dataView: { show: showTool, readOnly: showTool }
        }
      },
      legend: {
        data: [title]
      },
      xAxis: [
        {
          type: 'category',
          name: xName,
          nameGap: 10,
          data: xData,
          axisLabel: {
            formatter: `{value}${xUnit}`
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: `${yName} / 个`,
          data: yData,
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      itemStyle: {
        normal: {
          color
        }
      },
      series: [
        {
          type,
          silent: true,
          areaStyle: {
            normal: {}
          },
          markPoint: {
            data: [
              { name: '', coord: [markX, markY], symbolSize }
            ],
            label: {
              normal: {
                show: true,
                formatter: `${markValue?'当前'+xName+markValue+markUnit:''}`,
                position: 'top',
                textStyle: {
                  color: 'red'
                }
              }
            }
          },
          data: seriesData
        }
      ]
    };
    return option;
  }

  render() {
    const { mapData, chartStyle } = this.props;
    const analysisType = this.state.analysisType;
    return (<div>
      <ul className="Banalysis_type">
        <li
          onClick={this.changeAnalysisType.bind(this, 0)}
          style={!analysisType ? { background: '#ff7e3f', color: '#fff' } : {}}
        >刑期<b /></li>
        <li
          onClick={this.changeAnalysisType.bind(this, 1)}
          style={analysisType === 1 ? { background: '#2dc7c9', color: '#fff' } : {}}
        >罚金 <b /></li>
        <li
          onClick={this.changeAnalysisType.bind(this, 2)}
          style={analysisType === 2 ? { background: '#5bb1ef', color: '#fff' } : {}}
        >缓刑 <b /></li>
      </ul>
      <div className="Banalysis_title">
        {!analysisType ? '刑期分布统计图' : analysisType === 1 ? '罚金统计分布图' : '缓刑统计分布图'}
      </div>
      {
        (!analysisType && this.mainShow) || (analysisType === 1 && this.fineShow) || (analysisType === 2 && this.probationShow) ?
          <div className="analysis_big">
            {mapData ?
              <ReactEcharts
                option={this.getOption()}
                style={chartStyle}
              /> : ''
            }
          </div>
          :
          <div className="big_no_data" />
      }
    </div>);
  }
}
Analysis.propTypes = {
  chartStyle: React.PropTypes.object.isRequired,
  predictProperty: React.PropTypes.object.isRequired,
  mapData: React.PropTypes.array.isRequired
};
export default Analysis;
