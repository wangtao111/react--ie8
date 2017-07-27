/**
 * Created by frank on 2017/6/14.
 */

import React from 'react';
import { Modal, message } from 'antd';
import Component from '../../../constants/Component';
import Title from './Title';
import List from './List';

const confirm = Modal.confirm;
class UserList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRowKeys: [],
      columns: [],
      data: [],
      loading: false,
      pagination: {
        pageSize: 10,
        page: 1,
        current: 1
      },
      form: {}
    };
  }
  componentDidMount() {
    this.getProvinces();
    this.refreshList();
  }
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  getProvinces = () => {
    this.$api.decision.province.request().then(({ data }) => {
      Object.assign(this.$store.state.provinces, data.data);
    });
  };
  changeForm = (obj) => {
    const pagination = Object.assign(this.state.pagination, { pageSize: 10, page: 1, current: 1 });
    this.setState({
      pagination
    });
    Object.assign(this.$store.state.userForm, obj);
    this.refreshList();
  };
  refreshList = () => {
    const arr = [];
    const pagination = this.state.pagination;
    const params = this.$store.state.userForm;
    Object.assign(params, { page_size: 10, ran: Math.random() });
    console.log('列表参数', params);
    this.setState({
      loading: true
    });
    this.$api.decision.user.request(params).then(({ data }) => {
      console.log('分页数据', JSON.stringify(pagination));
      Object.assign(pagination, { total: data.pager.total });
      for (let i = 0; i < data.data.length; i += 1) {
        const levelId = data.data[i].events_grade;
        const typeId = data.data[i].events_industry_id;
        let level = '高院';
        let type = '法院';
        switch (levelId) {
        case 1:level = '高院';break;
        case 2:level = '中院';break;
        case 3:level = '区县法院';break;
        default:break;
        }
        switch (typeId) {
        case 1:type = '法院';break;
        case 7:type = '检察院';break;
        default:break;
        }
        arr.push({
          key: i,
          index: i + 1,
          username: data.data[i].username,
          realname: data.data[i].real_name,
          password: '********',
          level,
          type,
          province: data.data[i].province_name,
          id: data.data[i]._id
        });
      }
      this.setState({
        loading: false,
        data: arr,
        pagination
      });
    });
  };
  deleteUserInfo = (index) => {
    const arr = [];
    const data = this.state.data;
    for (let i = 0; i < data.length; i += 1) {
      if (index === data[i].index) {
        arr.push(data[i].key);
      }
    }
    this.setState({
      selectedRowKeys: arr
    });
    this.selectDelete();
  };
  selectAll = () => {
    const arr = [];
    const data = this.state.data;
    for (let i = 0; i < data.length; i += 1) {
      arr.push(data[i].key);
    }
    this.setState({
      selectedRowKeys: arr
    });
  };
  selectInvert = () => {
    const arr = [];
    const data = this.state.data;
    for (let i = 0; i < data.length; i += 1) {
      if (this.state.selectedRowKeys.indexOf(data[i].key) === -1) {
        arr.push(data[i].key);
      }
    }
    this.setState({
      selectedRowKeys: arr
    });
  };
  selectDelete() {
    confirm({
      title: '您是否确认要删除?',
      content: '删除后无法撤销!',
      width: '380',
      onOk: () => {
        const arr = [];
        const data = this.state.data;
        for (let i = 0; i < data.length; i += 1) {
          if (this.state.selectedRowKeys.indexOf(data[i].key) !== -1) {
            arr.push(data[i].id);
          }
        }
        this.$api.decision.deleteUser.request({ ids: JSON.stringify(arr) }).then((res) => {
          if (res.data.code) {
            message.error('删除失败！');
            this.setState({
              loading: false
            });
          } else {
            message.success('删除成功！');
            this.setState({
              selectedRowKeys: []
            });
            const pagination = Object.assign(this.state.pagination, { page: 1, current: 1 });
            Object.assign(this.$store.state.userForm, { page: 1, current: 1 });
            this.setState({
              pagination
            });
            this.refreshList();
          }
        });
      },
      onCancel: () => { }
    });
  }
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    const params = {
      page: pagination.current
    };
    Object.assign(this.$store.state.userForm, params);
    this.refreshList();
  }
  render() {
    return (
      <div className="user_list_div" >
        <Title changeForm={this.changeForm.bind(this)} />
        <List
          selectedRowKeys={this.state.selectedRowKeys}
          data={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          changeForm={this.changeForm.bind(this)}
          deleteUserInfo={this.deleteUserInfo.bind(this)}
          selectAll={this.selectAll.bind(this)}
          selectInvert={this.selectInvert.bind(this)}
          selectDelete={this.selectDelete.bind(this)}
          handleTableChange={this.handleTableChange.bind(this)}
          onSelectChange={this.onSelectChange.bind(this)}
        />
      </div>
    );
  }
}
export default UserList;
