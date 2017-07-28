/**
 * Created by frank on 2017/6/14.
 */
import React from 'react';
import { Select, Form, Button, Modal } from 'antd';
import Component from '../../../constants/Component';
import '../../../less/user_manage/user_manage.less';

const Option = Select.Option;
const FormItem = Form.Item;
const success = Modal.success;
const error = Modal.error;
class Title extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '请输入用户名称',
      showTModal: false,
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
      form: {
      }
    };
  }
  onblur() {
    if (this.state.value === '') {
      this.setState({ value: '请输入用户名称' });
    }
  }
  onfocus() {
    if (this.state.value === '请输入用户名称') {
      this.setState({ value: '' });
    }
  }
  addUser() {
    this.setState({
      showTModal: true
    });
  }
  handleCancel() {
    this.setState({
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
      form: {},
      showTModal: false
    });
  }
  handleOk() {
    console.log(this.state.form);
    if (this.state.modalInfo.user_name === ''
      || this.state.modalInfo.password === ''
      || this.state.modalInfo.province === ''
      || this.state.modalInfo.type === ''
    ) {
      this.setState({
        warning: {
          show: true,
          info: '输入或选择信息不可为空'
        }
      });
    } else {
      const params = this.state.form;
      this.$api.user.add_user.request(params).then(({data}) => {
        console.log(data);
        switch (data.code) {
        case 0: {
          success({
            title: '添加成功',
            onOk: () => {
              this.setState({
                warning: {
                  show: false,
                  info: ''
                },
                showTModal: false,
                modalInfo: {
                  user_name: '',
                  password: '',
                  province: '',
                  type: ''
                }
              });
              this.props.changeForm({ page: 1 });
            }
          });
          break;
        }
        case 2: {
          error({
            title: '用户已存在，添加失败',
            okText: '重新添加',
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
            title: '添加失败',
            okText: '重新添加',
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
    this.setState({
      form: Object.assign(this.state.form, { province: value }),
      modalInfo: Object.assign(this.state.modalInfo, { province: value })
    });
  };
  handleTypeChange = (value) => {
    this.setState({
      form: Object.assign(this.state.form, { events_industry_id: value }),
      modalInfo: Object.assign(this.state.modalInfo, { type: value })
    });
  };
  render() {
    const provinces = [];
    this.$store.state.provinces.map(province => (
      provinces.push(<Option key={province.id} value={province.name}>{province.name}</Option>)
    ));
    return (
      <div className="user_list_title_div">
        <Modal
          visible={this.state.showTModal}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="adduser_header">添加新用户</div>
          <div className="adduser">
            <span>用户名称：</span>
            <input
              type="text"
              value={this.state.modalInfo.user_name}
              onChange={(e) => {
                e.stopPropagation();
                this.state.modalInfo.user_name = e.target.value;
                this.setState({
                  warning: {
                    show: false,
                    info: ''
                  },
                  form: Object.assign(this.state.form, { user_name: e.target.value })
                });
              }}
            />
          </div>
          <div className="adduser">
            <span>密码：</span>
            <input
              type="text"
              value={this.state.modalInfo.password}
              onChange={(e) => {
                e.stopPropagation();
                this.state.modalInfo.password = e.target.value;
                this.setState({
                  warning: {
                    show: false,
                    info: ''
                  },
                  form: Object.assign(this.state.form, { password: e.target.value})
                });
              }}
            />
          </div>
          <div className="adduser_province">
            <span>省份：</span>
            <Select showSearch placeholder="省份" value={this.state.modalInfo.province} style={{ width: 270, marginTop: -1 }} onChange={this.handleProvinceChange}>
              {provinces}
            </Select>
          </div>
          <div className="adduser">
            <span>职业：</span>
            <input
              type="text"
              value={this.state.modalInfo.type}
              onChange={(e) => {
              e.stopPropagation();
              this.state.modalInfo.type = e.target.value;
              this.setState({
                warning: {
                  show: false,
                  info: ''
                },
                form: Object.assign(this.state.form, { type: e.target.value })
              });
            }}
            />
          </div>
          <div className="adduser_warning"><span>{this.state.warning.info}</span></div>
          <div className="adduser_footer">
            <Button className="adduser_button" key="submit" type="primary" size="large" onClick={this.handleOk.bind(this)}>确 定</Button>
            <Button className="adduser_button" key="back" type="ghost" size="large" onClick={this.handleCancel.bind(this)}>取 消</Button>
          </div>
        </Modal>
        <div className="user_list_title">
          <img className="user_list_title_img" alt="" src={require('../../../assets/user_manage/user_list_title.png')} />
          <span className="user_manage_span">用户管理</span>
        </div>
        <div className="user_list_filter">
          <span>用户名称</span>
          <Form
            inline
            onSubmit={
              (e) => {
                e.preventDefault();
                Object.assign(this.state.form, { page: 1 });
                this.props.changeForm(this.state.form);
              }
            }
          >
            <FormItem>
              <input
                type="text"
                className="user_list_filter_input"
                onBlur={this.onblur.bind(this)}
                onFocus={this.onfocus.bind(this)}
                onChange={(e) => {
                  if (this.state.value === '请输入用户名称') {
                    this.setState({
                      form: Object.assign(this.state.form, { username: '' })
                    });
                  } else {
                    this.setState({
                      value: e.target.value,
                      form: Object.assign(this.state.form, { username: e.target.value })
                    });
                  }
                }}
                value={this.state.value}
              />
              <input
                type="button"
                className="user_list_filter_input_img"
                onClick={() => {
                  if (this.state.value === '请输入用户名称') {
                    this.setState({
                      form: Object.assign(this.state.form, { username: '' })
                    });
                  } else {
                    this.setState({
                      form: Object.assign(this.state.form, { username: this.state.value })
                    });
                  }
                  Object.assign(this.state.form, { page: 1 });
                  this.props.changeForm(this.state.form);
                }}
              />
            </FormItem>
          </Form>
          <Button type="primary" onClick={this.addUser.bind(this)}><img alt="" src={require('../../../assets/user_manage/add.png')} /><p>添加新角色</p></Button>
        </div>
      </div>
    );
  }
}
Title.propTypes = {
  changeForm: React.PropTypes.func.isRequired
};
export default Title;
