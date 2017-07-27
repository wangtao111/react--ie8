/**
 * Created by Administrator on 2017/6/1.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import '../../less/login/login.less';
import { Input } from 'antd';
class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      password: '',
      warningWords: ''
    };
  }
  componentWillMount = () => {
    if (localStorage.userMsg) {
      const userMsg = JSON.parse(localStorage.userMsg);
      if (userMsg.username === 'jsgy' || userMsg.username === 'admin') {
        HashLocation.push('/count')
      } else {
        HashLocation.push('/case_list')
      }
    }
  };
  login = () => {
    console.log({username: this.state.username, password: this.state.password});
    localStorage.clear();
    if( !this.state.username ){
      this.setState({warningWords: '请输入用户名!'});
      return;
    }
    if( !this.state.password ){
      this.setState({warningWords: '请输入密码!'});
      return;
    }
    this.$api.decision.login.request({username: this.state.username, password: this.state.password}).then((response) => {
      console.log('登录信息', response);
      if(response.data.code ===2 ){
          this.setState({warningWords: response.data.msg});
          localStorage.userMsg = '';
      }else{
          this.setState({warningWords: ''});
          localStorage.userMsg = JSON.stringify(response.data.data);
          if(response.data.data.username === 'jsgy' || response.data.data.username === 'admin'){
            HashLocation.push('/count');
          }else{
            HashLocation.push('/case_list');
          }
      }
    });
  };
  onKeyup = (e) => {
    e.keyCode === 13 && this.login();
  };
  render = () => {
    const {username, password, warningWords } = this.state;
    return (
      <div id="login">
        <div className="content">
          <p>
            用户登录系统 <br />
            {/*<b>YONG HU DENG LU</b>*/}
          </p><br/>
          <div className="input_content">
            <i></i>
            <p>
              <Input style={window.ActiveXObject !== undefined ? {paddingTop: '15px'} : {}}
                     id="user"
                     value={username}
                     onChange={
                         (e) => {
                           this.setState({
                             username: e.target.value
                           });
                         }
                       }
                     placeholder="用户名"
                     size="large"/>
            </p>
          </div>
          <div className="input_content">
            <b></b>
            <p>
              <Input style={window.ActiveXObject !== undefined ? {paddingTop: '15px'} : {}}
                     id="password"
                     value={password}
                     type="password"
                     onChange={
                         (e) => {
                           this.setState({
                             password: e.target.value
                           });
                         }
                       }
                     onKeyUp={this.onKeyup.bind(this)}
                     placeholder="密码"
                     size="large"/>
            </p>
          </div>
          {
            warningWords ?<div className="warning">{warningWords}</div>:null
          }

          <div className="login_btn" onClick={this.login.bind(this)}><span>登录</span></div>
        </div>
      </div>)
  }
}
Login.propTypes = {

};
export default Login;
