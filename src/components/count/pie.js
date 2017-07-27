/**
 * Created by Administrator on 2017/5/21.
 */
import React from 'react';
import moment from 'moment';
import { HashLocation } from 'react-router';
import ReactEcharts from 'echarts-for-react';
import { RangePicker } from 'antd/lib/date-picker';
import Component from '../../constants/Component';
import '../../less/count/count.less';

class Pie extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: {
        start_time: '2016-09-01',
        end_time: '2017-05-01'
      }
    };
  }
  drawPie = () => {
    let option = {};
    if (this.props.pieData.length) {
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '预警统计',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '60%'],
            color: ['#fedc5e', '#f0831f', '#d8220d'],
            data: [
              { value: this.props.pieData[0], name: '一级预警' },
              { value: this.props.pieData[1], name: '二级预警' },
              { value: this.props.pieData[2], name: '三级预警' }
            ],
            label: {
              normal: {
                textStyle: { fontSize: 14 }
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
  toCaselist = () => {
    localStorage.ids = '';
    HashLocation.push('/case_list');
  };
  clickChange = (params) => {
    let ids = [];
    console.log('88888888', this.props.pieCaseList);
    if(params.componentSubType === 'pie'){
      if(params.name === "一级预警"){
        ids=this.props.pieCaseList[1];
      }else if(params.name === "二级预警"){
        ids=this.props.pieCaseList[2];
      }else{
        ids=this.props.pieCaseList[3];
      }
    }
    localStorage.ids = JSON.stringify(ids);
    if(ids.length){
      console.log(ids.length);
      HashLocation.push('/case_list');
    }
  };
  render = () => {
    const { pieData, chartsClick, changeDate, newCase, newCaseRatio } = this.props;
    const { form } = this.state;
    return (
      <div className="deviation_count">
        <p>偏离度预警案件分布
          <RangePicker
            style={{ width: '200px', float: 'right', marginRight: '10px' }}
            value={[form.start_time, form.end_time]}
            size="large"
            format="yyyy-MM-dd"
            onChange={(val) => {
              const val1 = moment(val[0]).format('YYYY-MM-DD');
              const val2 = moment(val[1]).format('YYYY-MM-DD');
              const obj = Object.assign(form, { start_time: val1, end_time: val2 });
              changeDate(obj);
            }}
          />
        </p>
        <div>
          <div className="item">
            <p>新增案件 <b>{newCase}</b> 起  &nbsp; 预警案件占比 <b>{newCaseRatio}</b> <span className="to_list" onClick={this.toCaselist.bind(this)}>案件列表</span></p>
            <ul>
              <li>三级预警案件 <b style={{ color: '#d8220d' }} onClick={this.clickChange.bind(this, { componentSubType: 'pie', name: '三级预警' })}>{pieData[2]}</b> 起</li>
              <li>二级预警案件 <b style={{ color: '#f0831f' }} onClick={this.clickChange.bind(this, { componentSubType: 'pie', name: '二级预警' })}>{pieData[1]}</b> 起</li>
              <li>一级预警案件 <b style={{ color: '#fedc5e' }} onClick={this.clickChange.bind(this, { componentSubType: 'pie', name: '一级预警' })}>{pieData[0]}</b> 起</li>
            </ul>
          </div>
          <div className="line" />
          <div id="pie">
            {pieData[0] ?
              <ReactEcharts
                option={this.drawPie()}
                style={{ width: '300px', height: '180px' }}
                onEvents={{ click: chartsClick }}
              /> : ''
            }
          </div>
          <ul className="range">
            <li onClick={chartsClick({ componentSubType: 'pie', name: '三级预警' })}><b />偏离度大于70%（绝对值）</li>
            <li><b />偏离度50%-70%（绝对值）</li>
            <li><b />偏离度30%-50%（绝对值）</li>
          </ul>
        </div>
        {/* <div className="no_data">*/}

        {/* </div>*/}
      </div>
    );
  }
}
Pie.propTypes = {
  pieData: React.PropTypes.array.isRequired,
  changeDate: React.PropTypes.func.isRequired,
  chartsClick: React.PropTypes.func.isRequired
};
export default Pie;
