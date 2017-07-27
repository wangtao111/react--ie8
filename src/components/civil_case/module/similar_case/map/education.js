/**
 * Created by hui on 2017/3/27.
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Education extends Component {

  getOption() {
    const option = {
      title: {
        text: this.props.name,
        textStyle: {
          fontWeight: 100,
          color: '#4C5E70',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: '40%',
          center: ['50%', '60%'],
          data: this.props.party,
          color: ['#70b0eb', '#95cb9d', '#cb8082', '#8f98b2', '#f5bb8a', '#95b7cb', '#79cfd2', '#95cb9d'],
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
Education.propTypes = {
  party: React.PropTypes.array.isRequired,
  name: React.PropTypes.string.isRequired
};
export default Education;
