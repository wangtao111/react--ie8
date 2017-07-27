/**
 * Created by Candy on 2017/3/23.
 */
/* eslint-disable import/extensions, import/no-extraneous-dependencies, import/no-webpack-loader-syntax*/
import { Route, DefaultRoute } from 'react-router';
import React from 'react';
import CaseList from 'react-router?name=case_list!./components/case_list';
import CaseDetail from 'react-router?name=detail!./components/case_detail/case_detail';
import Count from 'react-router?name=count!./components/count/count';
import CaseWarning from 'react-router?name=warning!./components/case_warning/case_warning';
import lawDetail from 'react-router?name=login!./components/case_warning/module/similar_case/laws_detail';
import Login from 'react-router?name=login!./components/login/login';
import CivilCase from 'react-router?name=civil_case!./components/civil_case/civil_case';
import UserManage from 'react-router?name=user_manage!./components/user_manage/user_manage';
import CaseUpload from 'react-router?name=case_upload!./components/CaseUpload';

const routes = (
  <Route>
    <Route name="/case_warning" handler={CaseWarning} />
    <Route name="/case_upload" handler={CaseUpload} />
    <Route name="/civil_case" handler={CivilCase} />
    <Route name="/case_list" handler={CaseList} />
    <Route name="/law_detail" handler={lawDetail} />
    <Route name="/case_detail" handler={CaseDetail} ignoreScrollBehavior />
    <Route name="/count" handler={Count} />
    <Route name="/user_manage" handler={UserManage} />
    <DefaultRoute handler={Login} />
    {/* <Route path="/param_weight" handler={ParamWeight}/>*/}
  </Route>
);
module.exports = routes;
