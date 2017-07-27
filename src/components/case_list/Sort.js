/**
 * Created by wuhao on 2017/3/25.
 */
import React from 'react';
import Component from '../../constants/Component';
import moment from 'moment';
import { HashLocation } from 'react-router';
import { RangePicker } from 'antd/lib/date-picker';
import { Form, DatePicker, Upload, Modal, Icon, message, Select, Input } from 'antd';

class Sort extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user_mode: 1,
      form: {},
      start_time: null,
      end_time: null,
      cancel: true,
      timeOption: new Date(),
      courtList: [],
      causeList: [
        { id: 1, name: '刑事案' },
        { id: 2, name: '民事案' }
      ],
      procuratorateList: [],
      docTypeOption: [
        { name: '全部', id: '' },
        { name: '判决书', id: 1 },
        { name: '公诉书', id: 7 }
      ],
      visible: false,
      caseContent: ''
    };
    this.start_time = null;
    this.end_time = null;
    this.provinceId = 3;
    this.date_option = [
      {name: '不限时间', id: 0},
      {name: '一周内', id: 1},
      {name: '半个月内', id: 2},
      {name: '一个月内', id: 3},
      {name: '三个月内', id: 10},
      {name: '半年内', id: 20},
      {name: '一年内', id: 30},
    ];
    this.level_option = [
      {name: '不限', id: ''},
      {name: '三级预警', id: 3},
      {name: '二级预警', id: 2},
      {name: '一级预警', id: 1}
    ]
  }
  componentDidMount = () => {
    this.setState({form: this.$store.state.form});
    if(localStorage.userMsg){
      const userMsg = JSON.parse(localStorage.userMsg);
      userMsg.username === 'jsgy' ? this.setState({ user_mode: 1 }) : this.setState({ user_mode: 2 });
    }
  };
  changeSort = (val) => {
    const opt = { sort_type: val };
    this.setState({
      form: opt
    });
    this.$store.state.form = Object.assign(this.$store.state.form, opt);
    this.props.changeForm(opt);
  };
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
    if( field === 'start_time' ) {
      this.start_time = value;
    }else{
      this.end_time = value;
    }
    if( this.start_time && this.end_time ){
      const form = this.state.form;
      const val1 = moment(this.start_time).format('YYYY-MM-DD');
      const val2 = moment(this.end_time).format('YYYY-MM-DD');
      const obj = Object.assign(form, { start_time: val1, end_time: val2 , mode: 0});
      console.log('-------------')
      this.props.changeForm(obj);
    };
  }
  disabledStartDate = (start_time) => {
    if (!start_time || !this.state.end_time) {
      return false;
    }
    return start_time.getTime() >= this.state.end_time.getTime();
  }
  disabledEndDate = (end_time) => {
    if (!end_time || !this.state.start_time) {
      return false;
    }
    return end_time.getTime() <= this.state.start_time.getTime();
  }
  render() {
    const { pager, toggleDeleteMode, selectAll, invertSelect, deleteAllSelect } = this.props;
    const Option = Select.Option;
    const { options, changeForm } = this.props;
    const { form, uploadShow, start_time, end_time } = this.state;
    return (<div className="sort_div">
      <div className="option_content">
        <div>
          <span>
            <label >时间：</label>
            <Select
              dropdownMatchSelectWidth={false}
              size="large"
              placeholder="请选择时间"
              onChange={(val) => {
                const obj = Object.assign(form, { mode_option: val || '', mode: 1, page: 1, page_size: 10 });
                changeForm(obj);
              }}
              value={form.mode_option}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100px', marginBottom:'2px', marginRight:'10px' }}
            >
              {
                this.date_option.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
              }
            </Select>
          </span>
          <span>
            <label>日期选择 ： </label>
            <DatePicker disabledDate={this.disabledStartDate}
                        style={{width: '80px'}}
                        size="large"
                        value={start_time}
                        placeholder="开始日期"
                        onChange={this.onChange.bind(this, 'start_time')} /><span style={{color: '#999'}}>~</span>
            <DatePicker disabledDate={this.disabledEndDate}
                        style={{width: '80px'}}
                        size="large"
                        value={end_time}
                        placeholder="结束日期"
                        onChange={this.onChange.bind(this, 'end_time')} />
          </span>
          <span>
            <label>案由：</label>
            <Select
              dropdownMatchSelectWidth={false}
              showSearch
              size="large"
              placeholder="请选择案由"
              onChange={(val) => {
                const obj = Object.assign(form, { case_cause_id: val || '', page: 1, page_size: 10 });
                changeForm(obj);
              }}
              value={form.case_cause_id}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{ width: '100px' }}
            >
              {
                (options.caseCauses || []).map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
              }
            </Select>
          </span>
          {this.state.user_mode === 1 ?
            <span>
              <label>法院：</label>
              <Select
                dropdownMatchSelectWidth={false}
                value={form.court_id}
                size="large"
                onChange={(val) => {
                  const obj = Object.assign(form, { court_id: val === 'all' ? '' : val, page: 1, page_size: 10 });
                  changeForm(obj);
                }}
                filterable placeholder="请选择"
                style={{ width: '100px' }}
              >
                {
                  (options.courts || []).map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                }
              </Select>
            </span> : this.state.user_mode === 2 ?
              <span>
                <label>检察院：</label>
                <Select
                  dropdownMatchSelectWidth={false}
                  value={form.procuratorate_id}
                  size="large"
                  onChange={(val) => {
                    const obj = Object.assign(form, { procuratorate_id: val === 'all' ? '' : val, page: 1, page_size: 10 });
                    changeForm(obj);
                  }}
                  placeholder="请选择"
                  style={{ width: '100px' }}
                >
                  {
                    (options.procuratorates || []).map(item =>
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    )
                  }
                </Select>
              </span> : null}
          <span>
            <label>文书类型：</label>
            <Select
              value={form.doc_type}
              size="large"
              onChange={(val) => {
                const obj = Object.assign(form, { doc_type: val, page: 1, page_size: 10 });
                changeForm(obj);
              }}
              placeholder="请选择"
              style={{ width: '100px' }}
            >
              {
                this.state.docTypeOption.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
              }
            </Select>
          </span>
          <span>
            <label>预警等级：</label>
            <Select
              value={form.warning_level}
              size="large"
              onChange={(val) => {
                const obj = Object.assign(form, { warning_level: val, page: 1, page_size: 10 });
                changeForm(obj);
              }}
              placeholder="请选择"
              style={{ width: '100px' }}
            >
              {
                this.level_option.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
              }
            </Select>
          </span>
        </div>
      </div>
      <div className="case_manage">
        <div className="total" dangerouslySetInnerHTML={{ __html: `当前筛选条件下，共有<span>${pager.total || 0}</span>篇案例` }} />
        <div className="manage_div">
          <div className="manage_btn" onClick={toggleDeleteMode}><img alt="aegis" src={require('../../assets/home/list_btn.png')} />列表管理</div>
          {
            this.props.deleteModel ? <div className="select_option">
              <div className="select_btn" onClick={selectAll}>全选</div>
              <div className="select_btn" onClick={invertSelect}>反选</div>
              <div className="delete_select" onClick={deleteAllSelect}>
                <img alt="aegis" src={require('../../assets/home/delete_btn.png')} />删除
              </div>
            </div> : null
          }
        </div>
        <div className="sort">
          <label>排序方式：</label>
          <div className={form.sort_type === 0 ? 'sort_btn selected' : 'sort_btn'} onClick={this.changeSort.bind(null, 0)}>
            上传时间
          </div>
          <div className={form.sort_type === 1 ? 'sort_btn selected' : 'sort_btn'} onClick={this.changeSort.bind(null, 1)}>
            偏离度
          </div>
          <div className={form.sort_type === 2 ? 'sort_btn selected' : 'sort_btn'} onClick={this.changeSort.bind(null, 2)}>
            同判度
          </div>
          <div className={form.sort_type === 3 ? 'sort_btn selected' : 'sort_btn'} onClick={this.changeSort.bind(null, 3)}>
            日期
          </div>
          <div className={form.sort_type === 4 ? 'sort_btn selected' : 'sort_btn'} onClick={this.changeSort.bind(null, 4)}>
            案号
          </div>
        </div>
      </div>

    </div>);
  }
}
Sort.propTypes = {
  pager: React.PropTypes.object.isRequired,
  toggleDeleteMode: React.PropTypes.func.isRequired,
  selectAll: React.PropTypes.func.isRequired,
  invertSelect: React.PropTypes.func.isRequired,
  deleteAllSelect: React.PropTypes.func.isRequired,
  deleteModel: React.PropTypes.bool.isRequired,
  changeForm: React.PropTypes.func.isRequired
};
export default Sort;
