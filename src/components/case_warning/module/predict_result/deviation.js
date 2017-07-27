/**
 * Created by Administrator on 2017/4/18.
 */

import ReactEcharts from 'echarts-for-react';
import React, { Component } from 'react';

class Deviation extends Component {

  getOption() {
    let option = {};
    if (this.props.dashboard.total !== 'null') {
      option = {
        series: {
          type: 'gauge',
          z: 3,
          startAngle: 180,
          endAngle: 0,
          min: this.props.dashboard.min,
          max: this.props.dashboard.max,
          splitNumber: 4,
          center: ['50%', '90%'],    // 默认全局居中
          axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
              color: [[0.25, this.props.dashboard.color[0]], [0.75, this.props.dashboard.color[1]], [1, this.props.dashboard.color[2]]],
              // 红#D87B81 绿#5FB891 蓝#5BB1F0
              width: 10
            }
          },
          axisTick: {
            show: false,
            splitNumber: 0,
            length: 0,
            lineStyle: {
              color: '#eee',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            show: true,
            interval: 'auto',
            inside: false,
            margin: 20
          },
          splitLine: {
            show: true,
            length: 5
          },
          pointer: {
            width: 4,
            length: '58%',
            color: 'rgba(255,255,255,.8)'
          },
          radius: 75,
          title: {
            show: true,
            offsetCenter: [0, '-60%'],
            textStyle: {
              color: '#333',
              fontSize: 15
            }
          },
          data: [{ value: this.props.dashboard.total, name: '' }]
        }
      };
    }
    return option;
  }

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '100px', width: '160px' }}
        />
      </div>
    );
  }
}
Deviation.propTypes = {
  dashboard: React.PropTypes.object.isRequired
};
export default Deviation;
