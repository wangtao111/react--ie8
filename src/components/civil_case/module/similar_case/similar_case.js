/**
 * Created by Administrator on 2017/4/18.
 */
/* eslint-disable linebreak-style*/
import React from 'react';
import Select from 'antd/lib/select';
import { Pagination, Spin } from 'antd';
import '../../../../less/civil_case/similar_case.less';
import Component from '../../../../constants/Component';
import SimilarCaseList from './similar_case_list';
import LawRule from './law_rules';
import PublicOpinion from './public_opinion';
import LawStatistics from './law_statistics';
import Map from './map/map';
import PartyEducation from './party_education';

const Option = Select.Option;
class SimilarCase extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pane_active: 0,
      loading: true,
      similarOptions: [
        { text: '90%', value: 0 },
        { text: '80%', value: 10 },
        { text: '70%', value: 20 },
        { text: '60%', value: 30 },
        { text: '50%', value: 40 },
        { text: '40%', value: 50 }
      ],
      timeOptions: [
        { text: '近一年', value: 0 },
        { text: '近三年', value: 10 },
        { text: '近五年', value: 20 }
      ],
      locationOptions: [
        { text: '全院', type: 0 },
        { text: '本市', type: 1 },
        { text: '本省', type: 2 },
        { text: '全国', type: 3 }
      ],
      form: {
        similar_option: 50,
        time_option: 10,
        location_params: { type: 2 }
      },
      location: 2
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.location) {
      const form = this.state.form;
      form.location_params = nextProps.location;
      this.setState({ location: nextProps.location.type !== 'undefined' ? nextProps.location.type : '' });
      this.setState({ form });
    }
  };
  changePaneActive = (val) => {
    this.setState({ pane_active: val });
  };
  changeText = () => {
    this.setState({
      textHidden: !this.state.textHidden
    });
  };

  render() {
    const { similarCase, caseList, tags, changeForm, loading, total } = this.props;
    const { form, similarOptions, timeOptions, locationOptions, location } = this.state;
    return (
      <div className="similar_civil_case">
        <ul className="pane_title">
          <li
            onClick={this.changePaneActive.bind(this, 0)}
            className={this.state.pane_active === 0 ? 'pane_item_active' : ''}
          >
            <i />案例推送
          </li>
          <li
            onClick={this.changePaneActive.bind(this, 1)}
            className={this.state.pane_active === 1 ? 'pane_item_active' : ''}
          >
            <i /> 法律适用
          </li>
          <li
            onClick={this.changePaneActive.bind(this, 2)}
            className={this.state.pane_active === 2 ? 'pane_item_active' : ''}
          >
            <i /><b>法</b><b className="blue">信</b>推送
          </li>
          <li
            onClick={this.changePaneActive.bind(this, 3)}
            className={this.state.pane_active === 3 ? 'pane_item_active' : ''}
          >
            <i /> 舆情推送
          </li>
          <li
            onClick={this.changePaneActive.bind(this, 4)}
            className={this.state.pane_active === 4 ? 'pane_item_active' : ''}
          >
            <i /> 知识图谱
          </li>
        </ul>
        {
          this.state.pane_active === 0 ?
            <div className="civil_similar_options">
              <span>区域</span>
              <Select
                value={location}
                size="large"
                style={{ width: '100px', margin: '0 20px' }}
                onChange={(val) => {
                  const obj = Object.assign(form, { location_params: { type: val } });
                  this.setState({
                    location: val
                  });
                  changeForm(obj);
                }}
              >
                {
                  locationOptions.map(item => (
                    <Option key={item.type} value={item.type}>{item.text}</Option>
                  ))
                }
              </Select>
              {/* <span>相似度</span>*/}
              {/* <Select*/}
              {/* value={form.similar_option}*/}
              {/* size="large"*/}
              {/* style={{ width: '100px', margin: '0 20px' }}*/}
              {/* onChange={(val) => {*/}
              {/* const obj = Object.assign(form, { similar_option: val });*/}
              {/* this.setState({*/}
              {/* form: obj*/}
              {/* });*/}
              {/* changeForm(obj);*/}
              {/* }}*/}
              {/* >*/}
              {/* {*/}
              {/* similarOptions.map(item => (*/}
              {/* <Option key={item.value} value={item.value}>{item.text}</Option>*/}
              {/* ))*/}
              {/* }*/}
              {/* </Select>*/}
              <span>时间</span>
              <Select
                value={form.time_option}
                size="large"
                style={{ width: '100px', margin: '0 20px' }}
                onChange={(val) => {
                  const obj = Object.assign(form, { time_option: val });
                  this.setState({
                    form: obj
                  });
                  changeForm(obj);
                }}
              >
                {
                  timeOptions.map(item => (
                    <Option key={item.value} value={item.value}>{item.text}</Option>
                  ))
                }
              </Select>
              <span>争议事实认定:</span>
              <div className="support_btn support_yes">支持</div>
              <div className="support_btn">不支持</div>
            </div>
            : null
        }
        {/* <p className="search_title"></p>*/}
        <div className="pane_content">
          {this.state.pane_active === 0 ?
            (caseList ?
              <SimilarCaseList caseList={caseList} tags={tags} changeForm={changeForm} />
              : null) : null}
          {this.state.pane_active === 1 ?
            (similarCase.law_statistics ?
              <LawStatistics lawStatistics={this.props.lawStatistics} laws_low={this.props.laws_low} laws={this.props.laws} redBooks_low={this.props.redBooks_low} redBooks={this.props.redBooks} />
              : null) : null}
          {this.state.pane_active === 2 ?
            <LawRule similarCase={similarCase} /> : null}

          {this.state.pane_active === 3 ?
            <PublicOpinion similarCase={similarCase} /> : null}
          {this.state.pane_active === 4 && this.props.echartsShow ?
            <Map similarCase={similarCase} provinceName={this.props.provinceName} /> : null}
          {this.state.pane_active === 1 ? <div className="page_div">
            <Pagination
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['5', '10', '15', '20']}
              pageSize={5}
              onShowSizeChange={(current, pageSize) => {
                const obj = Object.assign(form, { page: 1, page_size: pageSize });
                changeForm(obj);
              }}
              onChange={(currentPage) => {
                const obj = Object.assign(form, { page: currentPage, page_size: 5 });
                changeForm(obj);
              }}
              defaultCurrent={1}
              total={total}
            />
          </div> : null}
        </div>
      </div>
    );
  }
}
SimilarCase.propTypes = {
  tags: React.PropTypes.array.isRequired,
  similarCase: React.PropTypes.object.isRequired,
  changeForm: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool.isRequired,
  caseList: React.PropTypes.array.isRequired
};
export default SimilarCase;
