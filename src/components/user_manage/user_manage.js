/**
 * Created by frank on 2017/6/14.
 */
import React from 'react';
import Component from '../../constants/Component';
import Navigation from './user_manage_title/Navigation';
import UserList from './user_manage_list/user_manage_list';

class UserManage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  render= () => (
    <div className="um_home_div">
      <Navigation />
      <UserList />
    </div>
  )
}
export default UserManage;
