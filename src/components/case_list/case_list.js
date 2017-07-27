/**
 * Created by wuhao on 2017/3/25.
 */
import React from 'react';
import { Pagination } from 'antd';
import Component from '../../constants/Component';
import List from './List';

class CaseList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.pager = { page: 1, total: 0, page_size: 10 };
  }
  componentDidMount = () => {
    if (localStorage.user) {
      this.$store.state.user = JSON.parse(localStorage.user);
    }
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.pager.total) {
      this.pager = nextProps.pager;
      this.pager.page_size = nextProps.pager.page_size;
      this.pager.total = nextProps.pager.total;
    } else {
      this.pager.page_size = 0;
      this.pager.total = 0;
    }
  };
  render = () => {
    const { caseList, deleteCase, chooseDelete, deleteCases, changeForm, deleteModel } = this.props;
    // const { pager } = this.state;
    return (<div className="case_list_div">
      <List
        caseList={caseList}
        changeShowErr={this.props.changeShowErr}
        deleteCase={deleteCase}
        deleteModel={deleteModel}
        deleteCases={deleteCases}
        chooseDelete={chooseDelete}
      />
      <div className="page_div">
        <Pagination
          showSizeChanger
          showQuickJumper
          onShowSizeChange={(current, pageSize) => {
            this.pager.page_size = pageSize;
            changeForm({ page: 1, page_size: pageSize });
          }}
          onChange={(currentPage) => {
            this.pager.page = currentPage;
            changeForm({ page: currentPage, page_size: this.pager.page_size });
          }}
          pageSize={this.$store.state.form.page_size}
          total={this.pager.total}
          current={this.pager.page}
        />
      </div>
    </div>);
  }
}
CaseList.propTypes = {
  caseList: React.PropTypes.array.isRequired,
  deleteCase: React.PropTypes.func.isRequired,
  chooseDelete: React.PropTypes.func.isRequired,
  deleteCases: React.PropTypes.array.isRequired,
  changeForm: React.PropTypes.func.isRequired,
  changeShowErr: React.PropTypes.func.isRequired
};
export default CaseList;
