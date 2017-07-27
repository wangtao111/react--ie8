/**
 * Created by hui on 2017/3/27.
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Native extends Component {

  getOption() {
    const option = {
      title: {
        text: '当事人职业统计',
        textStyle: {
          fontWeight: 100,
          color: '#4C5E70',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      calculable: true,
      color: ['#5BB1F0'], // ["#0771de", "#dcfdfe"]
      xAxis: {// 舟山市  杭州市  宁波市   台州市   温州市  丽水市 衢州市  金华市 绍兴市 嘉兴市 湖州市
        type: 'category',
        data: this.props.party_native_count.citys,
        axisLabel: {
          show: true,
          width: 5,
          interval: 0,    // {number}
          textStyle: {
            fontSize: 5
          }
        }
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          data: this.props.party_native_count.values
        }
      ]
    };
    return option;
  }

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '340px', width: '290px' }}
        />
      </div>
    );
  }
}
Native.propTypes = {
  party_native_count: React.PropTypes.object.isRequired
};
export default Native;
