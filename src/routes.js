/**
 * Created by Candy on 2017/3/23.
 */
/* eslint-disable import/extensions, import/no-extraneous-dependencies, import/no-webpack-loader-syntax*/
import { Route, DefaultRoute } from 'react-router';
import React from 'react';
import Login from 'react-router?name=login!./components/login/login';
import UserManage from 'react-router?name=user_manage!./components/user_manage/user_manage';

const routes = (
  <Route>
    <Route name="/user_manage" handler={UserManage} />
    <DefaultRoute handler={Login} />
  </Route>
);
module.exports = routes;
