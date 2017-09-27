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
         <div className="um_title">
              用户中心
              <br /><b>YONG HU ZHONG XIN</b>
          </div>
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
