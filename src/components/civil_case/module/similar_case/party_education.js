/**
 * Created by Administrator on 2017/4/18.
 */

import React from 'react';
import Component from '../../../../constants/Component';
import Education from './map/education';
import Native from './map/native';

class PartyEducation extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount = () => {

  };
  render() {
    const { similarCase } = this.props;
    return (
      <div className="pane">
        <div className="subject-information">
          {similarCase.party_education[0] ?
            <div>
              <div>
                <Education
                           party={similarCase.party_education}
                           name={'当事人学历'}
                />
              </div>
              <div>
                <Native party_native_count = {similarCase.party_native_count}/>
              </div>
              <div>
                <Education party={similarCase.party_record} name={'当事人前科'}/>
              </div>
            </div>
            : <div className="predict_pane" />
          }
        </div>
      </div>
    );
  }
}
PartyEducation.propTypes = {
  similarCase: React.PropTypes.object.isRequired
};
export default PartyEducation;
