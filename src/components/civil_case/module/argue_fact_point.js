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
      pieData: [25, 75]
    };
  }
  componentDidMount = () => {

  };
  drawPie = () => {
    let option = {};
    if (this.state.pieData.length) {
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '预警统计',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '60%'],
            color: ['#d8220d', '#fedc5e'],
            data: [
              { value: this.state.pieData[1], name: '不支持占比' },
              { value: this.state.pieData[0], name: '支持占比' }
            ],
            label: {
              normal: {
                textStyle: { fontSize: 16 }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }
    return option;
  };
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
  render = () => (
    <div className="argue_fact_point">
      <p>争议事实点 <b>查看详情></b></p>
      <div className="support" style={{ marginLeft: '150px' }}>
        <div>支持原因</div>
        <ul>
          <li>达到认知程度</li>
          <li>非高额资金</li>
          <li>履行出借义务</li>
          <li>鉴定意见认可</li>
        </ul>
      </div>
      <div className="support_count">
        <p>限制行为能力人的借款合同效力</p>
        <div id="civil_case_count">
          <ReactEcharts
            option={this.drawPie()}
            style={{ width: '310px', height: '180px' }}
          />
        </div>
      </div>
      <div className="support">
        <div style={{ color: '#f0831f' }}>不支持原因</div>
        <ul>
          <li>高额资金</li>
          <li>无收入来源</li>
          <li>缺乏证据证明</li>
          <li>不承担还款义务</li>
        </ul>
      </div>
    </div>
  )
}
export default ArgueFactPoint;
