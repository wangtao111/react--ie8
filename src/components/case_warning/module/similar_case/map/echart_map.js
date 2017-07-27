/**
 * Created by hui on 2017/3/27.
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
require('echarts/map/js/province/jiangsu.js');
require('echarts/map/js/province/shanghai.js');

class EchartMap extends Component {
  getOption() {
    let option = {};
    if (this.props.mapData.map_max) {
      const max = Math.round(this.props.mapData.map_max.value);
      let min = Math.round(this.props.mapData.map_min.value);
      if (this.props.mapData.map_max.value === this.props.mapData.map_min.value) {
        min = 0;
      }
      option = {
        tooltip: {
          trigger: 'item',
          formatter: (a) => {
            let str = `${a.name}<br/>`;
            str += `量刑：${a.value}个月<br/>`;
            str += `平均偏离度：${this.props.mapData.map_deviation[a.name]}`;
            if (!a.value) {
              str = `${a.name}<br/>无相似案例`;
            }
            return str;
          }
        },
        dataRange: {
          min,
          max,
          color: ['#0771de', '#dcfdfe'],
          text: ['高', '低'],
          calculable: true
        },
        series: [{
          type: 'map',
          map: this.props.mapData.province_name,
          selectedMode: 'single',
          itemStyle: {
            emphasis: { label: { show: this.props.mapData.province_name !== '上海', textStyle: { color: 'black' } } },
            normal: { label: { show: this.props.mapData.province_name !== '上海', textStyle: { color: 'black' } } }
          },
          textFixed: { Alaska: [20, -20] },
          data: this.props.mapData.map_judgement_term
        }]
      };
    }
    return option;
  }

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '400px', width: '350px' }}
        />
      </div>
    );
  }
}
EchartMap.propTypes = {
  mapData: React.PropTypes.object.isRequired
};
export default EchartMap;
