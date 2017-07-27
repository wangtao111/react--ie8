/**
 * Created by Administrator on 2017/5/21.
 */
import React from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Spin, Select } from 'antd';
import { RangePicker } from 'antd/lib/date-picker';
import Component from '../../constants/Component';
import '../../less/count/count.less';

class Line extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: {
        start_time: '2016-09',
        end_time: '2017-05',
        case_cause_id: 201
      }
    };
  }
  drawLine = () => {
    let option = {};
    if (this.props.lineData[0]) {
      option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['三级预警', '二级预警', '一级预警'],
          textStyle: { color: '#fff' }
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            name: '时间',
            data: this.props.lineData[0],
            nameTextStyle: {
              color: '#fff'
            },
            label: {
              normal: {
                textStyle: { color: '#fff' }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            name: '案件个数',
            axisLabel: {
              formatter: '{value}个'
            },
            nameTextStyle: {
              color: '#fff'
            }
          }
        ],
        series: [
          {
            name: '三级预警',
            type: 'line',
            color: ['#d8220d'],
            data: this.props.lineData[3],
            markPoint: {
              /* data : [
               {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
               {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
               ]*/
            }
            /* markLine : {
             data : [
             {type : 'average', name : '平均值'}
             ]
             }*/
          },
          {
            name: '二级预警',
            type: 'line',
            color: ['#f0831f'],
            data: this.props.lineData[2],
            markPoint: {
              /* data : [
               {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
               {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
               ]*/
            }
            /* markLine : {
             data : [
             {type : 'average', name : '平均值'}
             ]
             }*/
          },
          {
            name: '一级预警',
            type: 'line',
            color: ['#fedc5e'],
            data: this.props.lineData[1],
            markPoint: {
              // data : [
              //  {type : 'max', name: '最大值'}
              // ]
            }
            /* markLine : {
             data : [
             {type : 'average', name: '平均值'}
             ]
             }*/
          }
        ]
      };
    }
    return option;
  };
  render = () => {
    const { lineData, caseCauses, chartsClick, changeForm } = this.props;
    const { form } = this.state;
    return (
      <div className="case_cause_count">
        <p>预警案件数量趋势图
          <b>案由：</b>
          <Select
            dropdownMatchSelectWidth={false}
            showSearch
            size="large"
            placeholder="请选择案由"
            onChange={(val) => {
              const obj = Object.assign(form, { case_cause_id: val || '' });
              changeForm(obj);
            }}
            value={form.case_cause_id}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '100px', marginBottom: '4px' }}
          >
            {
              (caseCauses || []).map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
            }
          </Select>
        </p>
        <div>
          <div className="date_picker">
            <RangePicker
              style={{ width: '180px', float: 'right' }}
              value={[form.start_time, form.end_time]}
              size="large"
              format="yyyy-MM"
              onChange={(val) => {
                const val1 = moment(val[0]).format('YYYY-MM');
                const val2 = moment(val[1]).format('YYYY-MM');
                const obj = Object.assign(form, { start_time: val1, end_time: val2 });
                changeForm(obj);
              }}
            />
          </div>
          <div id="line">
            {lineData[0] ?
              <ReactEcharts
                option={this.drawLine()}
                style={{ width: '490px', height: '270px', marginTop: '50px' }}
                onEvents={{ click: chartsClick }}
              /> : ''
            }
          </div>
        </div>
        {/* <div className="no_data">*/}

        {/* </div>*/}
      </div>
    );
  }
}
Line.propTypes = {
  lineData: React.PropTypes.array.isRequired,
  caseCauses: React.PropTypes.array.isRequired,
  changeForm: React.PropTypes.func.isRequired,
  chartsClick: React.PropTypes.func.isRequired
};
export default Line;
