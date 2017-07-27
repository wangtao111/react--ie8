/**
 * Created by frank on 2017/6/14.
 */
/* eslint-disable no-console, no-unused-vars */
import React from 'react';
import { Select, Table, Button, Modal } from 'antd';
import Component from '../../../constants/Component';

const Option = Select.Option;
const success = Modal.success;
const error = Modal.error;
class List extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: [],
      showLModal: false,
      warning: {
        show: false,
        info: ''
      },
      modalInfo: {
        username: '',
        realname: '',
        password: '',
        province: '',
        level: '',
        type: ''
      },
      form: {}
    };
  }
  modifyUserInfo = (index) => {
    const data = this.props.data;
    let username = '';
    let realname = '';
    let password = '';
    let province = '';
    let level = '';
    let type = '';
    for (let i = 0; i < data.length; i += 1) {
      if (index === data[i].index) {
        username = data[i].username;
        realname = data[i].realname;
        password = '********';
        province = data[i].province;
        level = data[i].level;
        type = data[i].type;
      }
    }
    this.setState({
      showLModal: true,
      modalInfo: {
        username,
        realname,
        password,
        province,
        level,
        type
      }
    });
  };
  handleCancel() {
    this.setState({
      warning: {
        show: false,
        info: ''
      },
      form: {},
      showLModal: false
    });
  }
  handleOk() {
    if (this.state.modalInfo.realname === '' || this.state.modalInfo.password === '') {
      this.setState({
        warning: {
          show: true,
          info: '输入信息不可为空'
        }
      });
    } else {
      Object.assign(this.state.form, { username: this.state.modalInfo.username });
      const params = this.state.form;
      this.$api.decision.modifyUser.request(params).then(({ data }) => {
        switch (data.code) {
        case 0: {
          success({
            title: '修改成功',
            onOk: () => {
              this.setState({
                warning: {
                  show: false,
                  info: ''
                },
                showLModal: false,
                modalInfo: {
                  username: '',
                  realname: '',
                  password: ''
                }
              });
              this.props.changeForm({ page: 1, page_size: 10 });
            }
          });
          break;
        }
        case 2: {
          error({
            title: '修改失败',
            okText: '重新修改',
            onOk: () => {
              this.setState({
                warning: {
                  show: false,
                  info: ''
                }
              });
            }
          });
          break;
        }
        default: {
          error({
            title: '修改失败',
            okText: '重新修改',
            onOk: () => {
              this.setState({
                warning: {
                  show: false,
                  info: ''
                }
              });
            }
          });
          break;
        }
        }
      });
    }
  }
  handleProvinceChange = (value) => {
    let id = 0;
    const provinces = this.$store.state.provinces;
    for (let i = 0; i < provinces.length; i += 1) {
      if (value === provinces[i].name) {
        id = provinces[i].id;
        break;
      }
    }
    const modalInfo = Object.assign(this.state.modalInfo, { province: value });
    this.setState({
      form: Object.assign(this.state.form, { province_id: id }),
      modalInfo
    });
  };
  handleLevelChange = (value) => {
    let id = 1;
    if (value === '高院') {
      id = 1;
    } else if (value === '中院') {
      id = 2;
    } else if (value === '区县法院') {
      id = 3;
    }
    const modalInfo = Object.assign(this.state.modalInfo, { level: value });
    this.setState({
      form: Object.assign(this.state.form, { events_grade: id }),
      modalInfo
    });
  };
  handleTypeChange = (value) => {
    let id = 1;
    if (value === '法院') {
      id = 1;
    } else if (value === '检察院') {
      id = 7;
    }
    const modalInfo = Object.assign(this.state.modalInfo, { type: value });
    this.setState({
      form: Object.assign(this.state.form, { events_industry_id: id }),
      modalInfo
    });
  };
  render() {
    const provinces = [];
    this.$store.state.provinces.map(province => (
      provinces.push(<Option key={province.name} value={province.name}>{province.name}</Option>))
    );
    const { selectedRowKeys, data, loading, pagination, selectAll,
      selectInvert, selectDelete, handleTableChange, onSelectChange, deleteUserInfo
    } = this.props;
    const list = this;
    const columns = [{
      title: '序号',
      className: 'column-index',
      dataIndex: 'index',
      key: 'index'
    }, {
      title: '省份',
      className: 'column-middle',
      dataIndex: 'province'
    }, {
      title: '机构等级',
      className: 'column-middle',
      dataIndex: 'level'
    }, {
      title: '机构类型',
      className: 'column-middle',
      dataIndex: 'type'
    }, {
      title: '用户名称',
      className: 'column-middle',
      dataIndex: 'username'
    }, {
      title: '真实姓名',
      className: 'column-middle',
      dataIndex: 'realname'
    }, {
      title: '密码',
      className: 'column-middle',
      dataIndex: 'password'
    }, {
      title: '操作',
      className: 'column-operation',
      key: 'operation',
      render(text, record) {
        return (
          <div className="operation">
            <input className="operation_btn modify" type="button" onClick={list.modifyUserInfo.bind(list, record.index)} />
            <input className="operation_btn delete" type="button" src={require('../../../assets/user_manage/delete.png')} onClick={deleteUserInfo.bind(list, record.index)} />
          </div>
        );
      }
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange.bind(this)
    };
    return (
      <div className="user_list_table_div">
        <Modal
          visible={this.state.showLModal}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="adduser_header">编辑用户信息</div>
          <div className="adduser">
            <span>用户名称：</span>
            <input className="modify_username_input" type="text" value={this.state.modalInfo.username} readOnly="readonly" />
          </div>
          <div className="adduser">
            <span>真实姓名：</span>
            <input
              type="text"
              value={this.state.modalInfo.realname}
              onChange={(e) => {
                e.stopPropagation();
                this.setState({
                  warning: {
                    show: false,
                    info: ''
                  },
                  modalInfo: Object.assign(this.state.modalInfo, { realname: e.target.value }),
                  form: Object.assign(this.state.form, { real_name: e.target.value })
                });
              }}
            />
          </div>
          <div className="adduser">
            <span>密码：</span>
            <input
              type="text"
              value={this.state.modalInfo.password}
              onFocus={(e) => {
                if (e.target.value === '********') {
                  this.setState({
                    warning: {
                      show: false,
                      info: ''
                    },
                    modalInfo: Object.assign(this.state.modalInfo, { password: '' })
                  });
                }
              }}
              onChange={(e) => {
                e.stopPropagation();
                this.setState({
                  warning: {
                    show: false,
                    info: ''
                  },
                  modalInfo: Object.assign(this.state.modalInfo, { password: e.target.value }),
                  form: Object.assign(this.state.form, { password: e.target.value })
                });
              }}
            />
          </div>
          <div className="adduser_province">
            <span>省份：</span>
            <Select
              showSearch
              value={this.state.modalInfo.province}
              style={{ width: 270, marginTop: -1 }}
              onChange={this.handleProvinceChange}
            >
              {provinces}
            </Select>
          </div>
          <div className="adduser_select">
            <span>机构等级：</span>
            <Select
              value={this.state.modalInfo.level}
              style={{ width: 270, marginTop: -1 }}
              onChange={this.handleLevelChange}
            >
              <Option value="高院">高院</Option>
              <Option value="中院">中院</Option>
              <Option value="区县法院">区县法院</Option>
            </Select>
          </div>
          <div className="adduser_select">
            <span>机构类型：</span>
            <Select
              value={this.state.modalInfo.type}
              style={{ width: 270, marginTop: -1 }}
              onChange={this.handleTypeChange}
            >
              <Option value="法院">法院</Option>
              <Option value="检察院">检察院</Option>
            </Select>
          </div>
          <div className="adduser_warning"><span>{this.state.warning.info}</span></div>
          <div className="adduser_footer">
            <Button className="adduser_button" key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>确 定</Button>
            <Button className="adduser_button" key="back" type="ghost" size="large" onClick={this.handleCancel.bind(this)}>取 消</Button>
          </div>
        </Modal>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange.bind(this)}
          bordered
        />
        <div className="user_list_table_btn">
          <Button type="primary" onClick={selectAll.bind(this)} >全选</Button>
          <Button type="primary" onClick={selectInvert.bind(this)} >反选</Button>
          <Button type="primary" onClick={selectDelete.bind(this)} >删除</Button>
        </div>
      </div>
    );
  }
}
List.propTypes = {
  pagination: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired,
  changeForm: React.PropTypes.func.isRequired,
  data: React.PropTypes.array.isRequired,
  selectedRowKeys: React.PropTypes.array.isRequired,
  selectAll: React.PropTypes.func.isRequired,
  selectInvert: React.PropTypes.func.isRequired,
  selectDelete: React.PropTypes.func.isRequired,
  handleTableChange: React.PropTypes.func.isRequired,
  deleteUserInfo: React.PropTypes.func.isRequired,
  onSelectChange: React.PropTypes.func.isRequired
};
export default List;
