/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { Input, Radio } from 'antd';
import Component from '../../constants/Component';

const RadioGroup = Radio.Group;

class BasicInfoPartyEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: []
    };
  }
  componentWillMount = () => {
    this.setState({
      form: this.props.party
    });
  }
  handleFormValueChange = (name, index, e) => {
    const change = [].concat(this.state.form);
    change[index][name] = e.target ? e.target.value : e;
    this.setState({
      form: change
    });
  }
  render = () => {
    const { caseInfo, party, toggleMode } = this.props;
    const { form } = this.state;
    return (
      <div>
        <div className="base_info_title clearfix">
          <div>{caseInfo.topCauseId !== 1 ? '当事人信息' : '被告人信息'}</div>
          <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleMode.bind(this, 'partyEdit', 'party_info_form', this.state.form)}
            >保存</span>
          </div>
        </div>
        {party.map((item, index) =>
           (<div key={index}>
             <div className="party_title">
               <span />
               <span>{caseInfo.topCauseId === 1 ? `被告${index + 1}:` : `当事人${index + 1}:`}</span>
             </div>
             <span>
               {Object.keys(item).map(key => (<div className="basic_content" key={key}>
                 <div className="basic_title">{key}</div>
                 <div className="basic_value important">
                   {(() => {
                     if (key === '原告被告') {
                       return (
                         <RadioGroup
                           onChange={this.handleFormValueChange.bind(null, key, index)} value={form[index][key]}
                         ><Radio value="原告">原告</Radio>
                           <Radio value="被告">被告</Radio></RadioGroup>);
                     }
                     if (key === '性别') {
                       return (
                         <RadioGroup
                           onChange={this.handleFormValueChange.bind(null, key, index)} value={form[index][key]}
                         >
                           <Radio value="男">男</Radio>
                           <Radio value="女">女</Radio>
                         </RadioGroup>);
                     }
                     return (
                       <Input placeholder="请输入内容" onChange={this.handleFormValueChange.bind(null, key, index)} value={form[index][key]} />);
                   })()}
                 </div>
               </div>))
                }
             </span>
           </div>))}
      </div>
    );
  }
}
BasicInfoPartyEdit.propTypes = {
  caseInfo: React.PropTypes.object.isRequired,
  toggleMode: React.PropTypes.func.isRequired,
  party: React.PropTypes.array.isRequired
};
export default BasicInfoPartyEdit;
