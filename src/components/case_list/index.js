/**
 * Created by Candy on 2017/3/23.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Spin, Modal, message } from 'antd';
import Component from '../../constants/Component';
import Title from './Title';
import CaseList from './case_list';
import '../../less/case_list/case_list.less';
import Sort from './Sort';
import { HashLocation } from 'react-router';
const confirm = Modal.confirm;
class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      deleteCases: [],
      loading: true,
      list: [],
      options: {},
      pager: {},
      checked: false,
      showTool: false,
      deleteModel: false
    };
    this.checkError={
      dataErrorValue:"文书数值错误",
      dataErrorUnit:"文书单位异常",//数据异常_单位错误
      dataErrorLessReason:"文书说理不充分",//数据异常_说理不充分
      dataErrorUnusual:"文书异常",//数据异常_文书异常
      dataErrorPrisonTerm: "刑期数据异常",//数据异常_刑期错误
      dataErrorTime:"时间数据异常",//数据异常_时间错误
      dataErrorAmount:"文书金额有误",//数据异常_金额错误
      multiDefendant:"文书复杂--多被告",//文书复杂_多被告
      multiCaseCause:"文书复杂--多案由"//文书复杂_多案由
    };
    this.userMsg = {};
  }
  componentWillMount = () =>{

  };
  componentDidMount = () => {
    if(localStorage.userMsg){
      this.userMsg = JSON.parse(localStorage.userMsg);
      this.$store.state.form.username = this.userMsg.username;
    }else{
      HashLocation.push('/');
      localStorage.userMsg = ''
    }
    this.setState({ checked: localStorage.test_mode });
    this.setState({ showTool: localStorage.showTool });
    this.refreshList();
    this.$api.decision.options.request({ provinceId: this.userMsg.province_id }).then(({ data }) => {
      this.setState({
        options: data.data
      });
      console.log('过滤条件数据', data);
    });
  }
  refreshList = () => {
    console.log('参数', this.$store.state.form);
    const params = this.$store.state.form;
    if(localStorage.ids){
      params.case_info_ids = localStorage.ids
    }else{
      params.case_info_ids = ''
    };
    this.$api.decision.cases.request( params ).then(({ data }) => {
      console.log('列表 数据', data, '参数', this.$store.state.form);
      if(!data.data[0]){
        this.setState({
          list: data.data,
          pager: data.pager,
          loading: false
        });
        this.$store.state.form.page = 1;
        this.$store.state.form.total = 0;
        this.$store.state.form.page_size = 10;
      }
      let list=data.data;
      let ids=[];
      for(let i=0;i<list.length;i++){
        ids.push(list[i].case_info_id);
      }
      if(ids[0]){
        this.$api.decision_result.get_err.request({ids:JSON.stringify(ids)}).then((response) => {
          if(!response.data.code){
            var n=response.data.data.checkInfoMap;
            if(response.data.code === 0){
              for (let i=0;i<list.length;i++){
                list[i].message = [];
                list[i].case_info.showErr=true;
                list[i].case_info.err=[];
                if(!list[i].case_info.errMsg){
                  list[i].case_info.errMsg = [];
                }
                for(let l=0;l<list[i].case_info.errMsg.length;l++){
                  if(!list[i].case_info.errMsg[l].delete){
                    list[i].case_info.err.push(list[i].case_info.errMsg[l]);
                  }
                }
                list[i].case_info.errMsg=list[i].case_info.err;
                if(n){
                  for (var id of Object.keys(n)){
                    if(id == list[i].case_info_id){
                      for (var key of Object.keys(n[id])){
                        if (n[id][key] === 1){
                          list[i].message.push(this.checkError[key]);
                          list[i].case_info.showErr=true;
                        }
                      }
                    }
                  }
                }
              }
            }
            this.setState({
              list: data.data,
              pager: data.pager,
              loading: false
            });
            this.$store.state.form.page = data.pager.page;
            this.$store.state.form.total = data.pager.total;
            this.$store.state.form.page_size = data.pager.page_size;
          }
        })
      };
    });
  }
  deleteCase = (ids) => {
    this.showConfirm(ids);
  }
  changeLoading = () => {
    console.log(8888888888)
    this.setState({loading: !this.state.loading});
  };
  toggleDeleteMode = () => {
    this.setState({
      deleteModel: !this.state.deleteModel
    });
  };
  showConfirm = (ids) => {
    confirm({
      title: '您是否确认要删除?',
      content: '删除后无法撤销!',
      width: '380',
      onOk: () => {
        this.setState({
          loading: true
        });
        this.$api.decision.delete.request({
          case_info_ids: JSON.stringify(ids),
          username: this.$store.state.form.username
        }).then(({ data }) => {
          if (data.code) {
            message.error('删除失败！');
            this.setState({
              loading: false
            });
          } else {
            message.success('删除成功！');
            this.setState({
              deleteCases: []
            });
            this.refreshList();
          }
        });
      },
      onCancel: () => { }
    });
  }
  changeForm = (obj) => {
    Object.assign(this.$store.state.form, obj);
    this.setState({
      loading: true
    });
    this.refreshList();
  }
  chooseDelete = (caseId) => {
    const index = this.state.deleteCases.indexOf(caseId);
    if (index !== -1) {
      this.state.deleteCases.splice(index, 1);
    } else {
      this.state.deleteCases.push(caseId);
    }
    this.setState({
      deleteCases: this.state.deleteCases
    });
    // console.log('要删除的文书列表： ', this.state.deleteCases);
  }
  selectAll = () => {
    const arr = [];
    const list = this.state.list;
    for (let i = 0; i < list.length; i += 1) {
      arr.push(list[i].case_info_id);
    }
    this.setState({
      deleteCases: arr
    });
  }
  invertSelect = () => {
    const arr = [];
    const list = this.state.list;
    for (let i = 0; i < list.length; i += 1) {
      if (this.state.deleteCases.indexOf(list[i].case_info_id) === -1) {
        arr.push(list[i].case_info_id);
      }
    }
    this.setState({
      deleteCases: arr
    });
  };
  deleteAllSelect = () => {
    this.deleteCase(this.state.deleteCases);
  };
  // 查找标签中文名
  searchChName = (value, List) => {
    let label = '';
    for (let i = 0; i < List.length; i += 1) {
      if (List[i].id === value) {
        label = List[i].name;
      }
    }
    return label;
  };
  onChange = () => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      localStorage.test_mode = '';
    } else {
      localStorage.test_mode = 1;
    }
  };
  changeShowErr = (index) => {
    let n = this.state.list;
    n[index].case_info.showErr = !n[index].case_info.showErr;
    this.setState({list:n});
  };
  logout = () => {
    HashLocation.push('/');
    this.$store.state.form = {};
    localStorage.userMsg = '';
  };
  changeTool = () => {
    this.setState({showTool: !this.state.showTool});
    if (this.state.showTool) {
      localStorage.showTool = '';
    } else {
      localStorage.showTool = 1;
    }
  }
  render = () => {
    const { pager, options, list, deleteCases, loading, checked, showTool, deleteModel } = this.state;
    const form = this.$store.state.form;
    return (
      <div className="home_div">
        {loading ? <div className="loading">
          <Spin size="large" />
        </div> : null}
        <div className={this.userMsg.username === 'xmzy' ? ' change_back nav' : 'nav'}>
          <div className="logout">
            <img alt="" src={require('../../assets/home/logo.png')} onClick={this.changeTool.bind(this)}/>
            {(() => {
              if(this.userMsg.username === 'xmzy'){
                return <div className="title">
                  同判智推
                  <br/><b>TONG PAN ZHI TUI</b>
                </div>
              }
              if(this.userMsg.username === 'jsgy' || this.userMsg.username === 'xmzy'){
                return <div className="title">
                  同案不同判预警系统
                  <br/><b>TONG AN BU TONG PAN YU JING XI TONG</b>
                </div>
              }else{
                return <div className="title">
                  量刑建议智能决策辅助系统
                  <br/><b>LIANG XING JIAN YI ZHI NENG JUE CE FU ZHU XI TONG</b>
                </div>
              }
            })()}
            {
              showTool ?
                <div className="switch">
                  文书纠错工具：<Switch checked={checked} onChange={this.onChange.bind(this)} />
                </div> : null
            }
            <div className="user">
              <img alt="" src={require('../../assets/count/user.png')} /><span>{this.$store.state.form.username}</span>
              {(this.userMsg.username === 'admin') ?
                <div className="user_manage_link" onClick={ () => {HashLocation.push('/user_manage')} }>
                  <img alt="" src={require('../../assets/user_manage/user_manage.png')} />
                  <span>用户管理</span>
                </div> : null}
              <img alt="" src={require('../../assets/count/out.png')} style={{top: '5px'}}/><a onClick={this.logout.bind(this)}>退出</a>
            </div>
          </div>
        </div>
        <Title form={form} options={options} userMsg={this.userMsg} changeLoading={this.changeLoading} changeForm={this.changeForm} />
        <Sort
          pager={pager}
          changeForm={this.changeForm}
          toggleDeleteMode={this.toggleDeleteMode}
          deleteModel={deleteModel}
          deleteAllSelect={this.deleteAllSelect}
          selectAll={this.selectAll}
          invertSelect={this.invertSelect}
          options={options}
        />
        <CaseList
          caseList={list}
          changeForm={this.changeForm}
          pager={pager}
          deleteModel={deleteModel}
          deleteCase={this.deleteCase}
          deleteCases={deleteCases}
          deleteAllSelect={this.deleteAllSelect}
          selectAll={this.selectAll}
          invertSelect={this.invertSelect}
          chooseDelete={this.chooseDelete}
          changeShowErr={this.changeShowErr}
          options={options}
        />
      </div>
    );
  }
}
Home.propTypes = {
  caseDetail: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
  return {
    caseDetail: state.caseDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}
// export default CaseDetail;
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
