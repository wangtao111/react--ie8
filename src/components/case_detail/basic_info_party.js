/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import Component from '../../constants/Component';

class BasicInfoParty extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  render() {
    const { caseInfo, party, toggleEditMode, mode } = this.props;
    return (
      <div className="basic_info">
        <div className="base_info_title clearfix">
          <div>{caseInfo.topCauseId !== 1 ? '当事人信息' : '被告人信息'}</div>
          {mode ? <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/bianji.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleEditMode.bind(null, 'partyEdit')}
            >编辑</span>
          </div> : ''}
        </div>
        {party.map((item, index) => (<div key={index}>
          <div className="party_title">
            <span />
            <span>{item['原告被告'] === '被告' ? `被告${index + 1}:` : `原告${index + 1}:`}</span>
          </div>
          <span>
            {Object.keys(item).map(key => (<div className="basic_content" key={key}>
              <div className="basic_title">{key}</div><div className="basic_value">{item[key]}</div>
            </div>))}
          </span>
        </div>))}
      </div>
    );
  }
}
BasicInfoParty.propTypes = {
  caseInfo: React.PropTypes.object.isRequired,
  party: React.PropTypes.array.isRequired,
  toggleEditMode: React.PropTypes.func.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default BasicInfoParty;
