/**
 * Created by frank on 2017/6/14.
 */
import React from 'react';
import Component from '../../../constants/Component';
import { HashLocation } from 'react-router';
import '../../../less/user_manage/user_manage.less';

class Navigation extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  exit = () => {
    HashLocation.push('/');
    localStorage.clear();
    Object.assign(this.$store.state.userForm, { page: 1, current: 1 });
  };
  render() {
    return (
      <div className="um_nav_div">
        <div className="um_nav">
          <img
            alt=""
            src={require('../../../assets/home/logo.png')}
          />
          {
            this.$store.state.form.username === 'jsgy' ? <div className="um_title">
              同案不同判预警系统
              <br /><b>TONG AN BU TONG PAN YU JING XI TONG</b>
            </div> : <div className="um_title">
              量刑建议智能决策辅助系统
              <br /><b>LIANG XING JIAN YI ZHI NENG JUE CE XI TONG</b>
            </div>
          }
          <div className="um_user">
            <img alt="" src={require('../../../assets/count/out.png')} style={{ top: '5px' }} />
            <a onClick={this.exit.bind(this)}>退出管理</a>
          </div>
        </div>
      </div>
    );
  }
}
export default Navigation;
