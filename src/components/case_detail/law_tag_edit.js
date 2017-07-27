/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../../constants/Component';
import '../../less/case_detail/right.less';

class LawTagEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: []
    };
  }
  goAnchor = (key) => {
    let anchor = '';
    const url = document.location.href.split('#');
    if (key) {
      anchor = key;
      HashLocation.push(`${url[1]}#${anchor}`);
    } else {
      anchor = url[2];
    }
    const element = document.getElementById(anchor);
    if (element) element.scrollIntoView();
  }
  render() {
    const { lawTagForm, handleLawTag, toggleMode } = this.props;
    return (
      <div className="law_tag">
        <div className="base_info_title clearfix">
          <div>法律标签</div>
          <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/baocun.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleMode.bind(this, 'lawEdit', lawTagForm)}
            >保存</span>
          </div>
        </div>
        <div className="base_info">
          {lawTagForm.map((item, index) => (<div className="basic_content" key={item.zhName}>
            <div className="tags_edit"><b>{item.zhName}</b>
              <span onClick={handleLawTag.bind(this, index)} /></div>
          </div>))}
        </div>
      </div>
    );
  }
}
LawTagEdit.propTypes = {
  lawTagForm: React.PropTypes.array.isRequired,
  handleLawTag: React.PropTypes.func.isRequired,
  toggleMode: React.PropTypes.func.isRequired
};
export default LawTagEdit;
