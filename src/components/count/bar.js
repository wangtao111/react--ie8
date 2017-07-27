/**
 * Created by Administrator on 2017/5/21.
 */
import React from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { RangePicker } from 'antd/lib/date-picker';
import Component from '../../constants/Component';
import '../../less/count/count.less';

class Bar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  drawBar = () => {
    let option = {};
    if (this.props.barData[0]) {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['三级预警', '二级预警', '一级预警'],
          top: '20',
          textStyle: { color: '#fff' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}个'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.props.barData[0],
          axisLabel: {
            fontSize: 15
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '一级预警',
            type: 'bar',
            color: ['#fedc5e'],
            stack: '总量',
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'insideRight'
            //   }
            // },
            data: this.props.barData[1]
          },
          {
            name: '二级预警',
            type: 'bar',
            color: ['#f0831f'],
            stack: '总量',
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'insideRight'
            //   }
            // },
            data: this.props.barData[2]
          },
          {
            name: '三级预警',
            type: 'bar',
            color: ['#d8220d'],
            stack: '总量',
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'insideRight'
            //   }
            // },
            data: this.props.barData[3]
          }
        ]
      };
    }
    return option;
  };
  render = () => {
    const { barData, chartsClick } = this.props;
    return (
      <div className="columnar">
        <p>各案由预警案件数量情况分布</p>
        <div id="bar">
          {barData[0] ?
            <ReactEcharts
              option={this.drawBar()}
              style={{ width: '890px', height: '370px' }}
              onEvents={{ click: chartsClick }}
            /> : ''
          }
        </div>
        {/* <div className="no_data">*/}
        {/* <span>*/}
        {/* 暂无统计数据*/}
        {/* </span>*/}
        {/* </div>*/}
      </div>
    );
  }
}
Bar.propTypes = {
  barData: React.PropTypes.array.isRequired,
  chartsClick: React.PropTypes.func.isRequired
};
export default Bar;
