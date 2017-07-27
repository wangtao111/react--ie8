/**
 * Created by Administrator on 2017/5/21.
 */
import React from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import Component from '../../constants/Component';
import '../../less/count/count.less';
require('echarts/map/js/province/jiangsu.js');
require('echarts/map/js/province/shanghai.js');
class Pie extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  drawMap = () => {
    let option = {};
    if (this.props.mapData[0] && this.props.userMsg.province_name) {
      option = {
        tooltip: {
          trigger: 'item',
          formatter(a) {
            let str = `${a.name}<br/>`;
            str += `案件总数：${a.data.value}个<br/>`;
            str += `一级预警：${a.data.warning[2]}个<br/>`;
            str += `二级预警：${a.data.warning[1]}个<br/>`;
            str += `三级预警：${a.data.warning[0]}个<br/>`;
            if (!a.value) {
              str = `${a.name}<br/>无预警案件`;
            }
            return str;
          }
        },
        dataRange: {
          min: this.props.mapMin.value > 0 ? Math.round(this.props.mapMin.value) : '',
          max: this.props.mapMax.value > 0 ? Math.round(this.props.mapMax.value) : '',
          color: ['#0771de', '#dcfdfe'],
          text: ['高', '低'],
          textStyle: {
            color: '#fff'
          },
          calculable: true
          // x: '-500',
          // y: '-500'
        },
        series: [{
          type: 'map',
          map: this.props.userMsg.province_name,
          selectedMode: 'single',
          itemStyle: {
            emphasis: { label: { show: this.props.userMsg.province_name !== '上海', textStyle: { color: 'black' } } },
            normal: { label: { show: this.props.userMsg.province_name !== '上海', textStyle: { color: 'black' } } }
          },
          label: {
            normal: {
              show: this.props.userMsg.province_name !== '上海'
            },
            emphasis: {
              show: this.props.userMsg.province_name !== '上海'
            }
          },
          textFixed: { Alaska: [20, -20] },
          data: this.props.mapData
        }]
      };
    }
    return option;
  };
  render = () => {
    const { mapData, chartsClick } = this.props;
    return (
      <div className="count_map">
        <p>地区预警案件数量分布</p>
        <div id="count_map">
          {mapData[0] ?
            <ReactEcharts
              option={this.drawMap()}
              style={{ width: '360px', height: '380px', marginLeft: '35px' }}
              onEvents={{ click: chartsClick }}
            /> : ''
          }
        </div>
      </div>
    );
  }
}
Pie.propTypes = {
  mapData: React.PropTypes.array.isRequired,
  mapMin: React.PropTypes.object.isRequired,
  mapMax: React.PropTypes.object.isRequired,
  chartsClick: React.PropTypes.func.isRequired,
  userMsg: React.PropTypes.object.isRequired
};
export default Pie;
