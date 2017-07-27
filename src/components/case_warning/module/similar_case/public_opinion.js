/**
 * Created by Administrator on 2017/5/4.
 */

import React from 'react';
import Component from '../../../../constants/Component';

class LawStatistics extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }

  componentDidMount = () => {
    this.setState({

    });
  };
  render() {
    return (
      <div className="pane">
        <div className="yuqing">

        </div>
        <div className="predict_pane">
        </div>
      </div>
    );
  }
}
LawStatistics.propTypes = {
  similarCase: React.PropTypes.object.isRequired
};
export default LawStatistics;
