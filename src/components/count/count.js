/**
 * Created by Candy on 2017/3/23.
 */
import React from 'react';
import '../../less/count/count.less';
import moment from 'moment';
import { HashLocation } from 'react-router';
import { Switch, Spin, Modal, message, Select } from 'antd';
import { RangePicker } from 'antd/lib/date-picker';
import Component from '../../constants/Component';
import Pie from './pie';
import Line from './line';
import Bar from './bar';
import Map from './map';
require('echarts/map/js/province/jiangsu.js');

class Count extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      form: {},
      lineData: [],
      pieData: [],
      newCase: '',
      newCaseRatio: '',
      pieCaseList: [],
      barData: [],
      barCaseList: [],
      mapData: [],
      mapCaseList: [],
      mapMax: {},
      mapMin: {},
      caseCauses: [],
    };
    this.userMsg = {}
  }
  componentWillMount = () => {
    if(localStorage.userMsg){
      this.userMsg = JSON.parse(localStorage.userMsg);
      this.$store.state.form.username = this.userMsg.username;
      if(this.userMsg.username !== 'jsgy'&&this.userMsg.username !== 'admin'){
        HashLocation.push('/case_list');
      }
    }else{
      HashLocation.push('/');
      localStorage.userMsg = ''
    }
  };
  componentDidMount = () => {
    let params = this.$store.state.countForm.otherDate;
    params.username = this.userMsg.username
    this.getOthers(params);
    let params1 = this.$store.state.countForm.lineDate;
    params1.username = this.userMsg.username;
    this.getLine(params1);
    this.getCaseCauses();
  };
  getCaseCauses = () => {
    this.$api.decision.options.request({ provinceId: this.userMsg.province_id }).then((response) => {
      const data = response.data.data;
      this.setState({ caseCauses: data.caseCauses });
    });
  };
  getLine = (params) => {
    params.username = this.userMsg.username;
    console.log('趋势图参数', params);
    this.$api.count.lineCount.request(params).then((response) => {
      this.setState({ lineData: response.data.data });
      console.log('趋势图',params,response)
    });
  };
  getOthers = (params) => {
    this.setState({ loading: true });
    params.username = this.userMsg.username;
    console.log('其他图参数',params);
    this.$api.count.otherCount.request(params).then((response) => {
      console.log('其他图',params,response);
      this.setState({ loading: false });
      const data = response.data.data;
      this.setState({ pieData: data.warning });
      this.setState({newCase: data.count});
      this.setState({newCaseRatio: data.ratio});
      this.setState({ pieCaseList: data.warning_case_ids });
      this.setState({ barData: data.cause_warning });
      this.setState({ barCaseList: data.case_cause_ids_dict });
      this.setState({ mapData: data.location_warning_list });
      this.setState({ mapMax: data.max_warning });
      this.setState({ mapMin: data.min_warning });
    });
  };
  changeDate = (obj) => {
    this.$store.state.countForm.otherDate = obj;
    this.getOthers(obj);
  };
  changeLineDate = (obj) => {
    this.$store.state.countForm.lineDate = obj;
    this.getLine(obj);
  };
  chartsClick = (params) => {
    let ids = [];
    console.log('88888888');
    if(this.state.barData[0]){
      if(params.componentSubType == 'line'){
        var index = 0;
        for (let i = 0; i<this.state.lineData[0].length; i++){
          if (this.state.lineData[0][i] == params.name){
            index = i;
          }
        }
        if(params.seriesName == "一级预警"){
          ids=this.state.lineData[4][0][index];
        }else if(params.seriesName == "二级预警"){
          ids=this.state.lineData[4][1][index];
        }else{
          ids=this.state.lineData[4][2][index];
        }
      }
      if(params.componentSubType == 'pie'){
        if(params.name == "一级预警"){
          ids=this.state.pieCaseList[1];
        }else if(params.name == "二级预警"){
          ids=this.state.pieCaseList[2];
        }else{
          ids=this.state.pieCaseList[3];
        }
      }
      if(params.componentSubType == 'bar'){
        if(params.seriesName == "一级预警"){
          ids=this.state.barCaseList[params.name][1];
        }else if(params.seriesName == "二级预警"){
          ids=this.state.barCaseList[params.name][2];
        }else{
          ids=this.state.barCaseList[params.name][3];
        }
      }
      if(params.componentSubType == 'map'){
        ids=params.data.case_ids;
      }
      localStorage.ids = JSON.stringify(ids);
      if(params.data){
        console.log(ids.length);
        HashLocation.push('/case_list');
      }
    }
  };
  logout = () => {
    // localStorage.access_token = "";
    // this.$store.state.user = '';
    // localStorage.user = '';
    // localStorage.user_info = "";
    // location.href = "http://180.96.11.73:9010/logout.html?app_url="+this.$store.state.appRemote;
    HashLocation.push('/');
    localStorage.userMsg = ''
  };
  render = () => {
    const { loading, pieCaseList, barData, barCaseList, mapData, mapCaseList, mapMax, mapMin, caseCauses } = this.state;

    return (
      <div>
        <div className="count_body"></div>
        {loading ? <div className="loading">
          <Spin size="large" />
        </div> : null}
        <div className="count_nav">
          <div className="logout">
            <img alt="" src={require('../../assets/home/logo.png')} />
            {
              this.userMsg.username === 'jsgy' ?<div className="title">
                同案不同判预警系统
                <br/><b>TONG AN BU TONG PAN YU JING XI TONG</b>
              </div>:<div className="title">
                量刑建议智能决策辅助系统
                <br/><b>LIANG XING JIAN YI ZHI NENG JUE CE FU ZHU XI TONG</b>
              </div>
            }
            <div className="user">
              <img alt="" src={require('../../assets/count/user.png')} /><span>{this.$store.state.form.username}</span>
              <img alt="" src={require('../../assets/count/out.png')} style={{top: '5px'}}/><a onClick={this.logout.bind(this)}>退出</a>
            </div>
          </div>
        </div>
        <div id="count_content">
          <p className="count_map_title">综合预警统计分析</p>
          <div className="count_top">
            <Pie pieCaseList={this.state.pieCaseList} pieData={this.state.pieData} newCase={this.state.newCase} newCaseRatio={this.state.newCaseRatio} chartsClick={this.chartsClick} changeDate={this.changeDate} />
            <Line lineData={this.state.lineData} caseCauses={this.state.caseCauses} changeForm={this.changeLineDate} chartsClick={this.chartsClick.bind(this)} />
            <div className="other_count">
              <p>其他预警类型</p>
              <ul>
                <li>文书数值错误 <i><b>0</b> 起</i></li>
                <li>缓刑数据异常 <i><b>0</b> 起</i></li>
                <li>敏感案件 <i><b>0</b> 起</i></li>
                <li>文书格式错误 <i><b>0</b> 起</i></li>
                <li>文书单位错误 <i><b>0</b> 起</i></li>
                <li>
                  其他文书错误 <i><b>0</b> 起</i>
                </li>
              </ul>
            </div>
          </div>
          <div className="count_bottom">
            <Bar barData={this.state.barData} chartsClick={this.chartsClick} />
            <Map mapData={this.state.mapData} userMsg={this.userMsg} mapMax={this.state.mapMax} mapMin={this.state.mapMin} chartsClick={this.chartsClick} />
          </div>
        </div>
      </div>
    );
  }
}
export default Count;
