/**
 * Created by Administrator on 2017/4/18.
 */

import React from 'react';
import Component from '../../../../../constants/Component';
import EchartMap from './echart_map';
require('echarts/map/js/province/jiangsu.js');
require('../../../../shanghai.js');

class Map extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount = () => {

  };
  render() {
    const { similarCase } = this.props;
    return (
      <div className="pane">
        {
          similarCase.map_judgement_term[0] ? <div>
            <div id="map">
              <div className="echarts_map_title">{this.props.provinceName === '上海' ? '上海市量刑统计分布地图':'江苏省量刑统计分布地图'}</div>
              <EchartMap
                mapData={{
                  map_deviation: similarCase.map_deviation,
                  map_judgement_term: similarCase.map_judgement_term,
                  map_max: similarCase.map_max,
                  map_min: similarCase.map_min,
                  province_name: this.props.provinceName
                }}
              />
            </div>
            <div id="predictive-information">
              <div><span className="dot">●</span>量刑最大的区域为
                <b>{similarCase.map_max.name}</b>， 平均量刑为
                <b>{similarCase.map_max.value} </b>个月
              </div>
              <div><span className="dot">●</span>量刑最小的区域为
                <b>{similarCase.map_min.name}</b>， 平均量刑为
                <b>{similarCase.map_min.value} </b>个月
              </div>
              <div><span className="dot">●</span>平均偏离度最大的区域为
                <b>{similarCase.max_deviation_city}</b></div>
              <div><span className="dot">●</span>平均偏离度最小的区域为
                <b>{similarCase.min_deviation_city}</b></div>
            </div>
          </div> :
            <div className="predict_pane" />
        }
      </div>
    );
  }
}
Map.propTypes = {
  similarCase: React.PropTypes.object.isRequired
};
export default Map;
