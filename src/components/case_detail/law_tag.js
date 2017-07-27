/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Tooltip from 'antd/lib/tooltip';
import Button from 'antd/lib/button';
import Component from '../../constants/Component';
import '../../less/case_detail/right.less';

class LawTag extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  goAnchor = (key) => {
    console.log(key);
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
    const { lawTagForm, lawMap, toggleEditMode, mode } = this.props;
    return (
      <div className="law_tag">
        <div className="base_info_title clearfix">
          <div>法律标签</div>
          {mode ? <div className="edit">
            <span><img alt="aegis" src={require('../../assets/case_detail/bianji.png')} /></span>
            <span
              style={{ color: '#21A0FF' }}
              onClick={toggleEditMode.bind(this, 'lawEdit')}
            >编辑</span>
          </div> : ''}
        </div>
        <div className="basic_content">
          <div className="base_info">
            {lawTagForm.map(item => (<div className="tags" key={item.tagId}>
              <a onClick={this.goAnchor.bind(this, item.startPos)}>
                {item.zhName}
                {lawMap[item.tagId] ?
                  <div className="tooltip">{lawMap[item.tagId].displayName}<br /><br />{lawMap[item.tagId].content}</div> :
                    ''}
              </a>
              {/*{item.description ? <Tooltip class="item" title={item.description}>*/}
                {/*<Button>规则</Button>*/}
              {/*</Tooltip> : ''}*/}
            </div>))}
          </div>
        </div>
      </div>
    );
  }
}
LawTag.propTypes = {
  lawMap: React.PropTypes.object.isRequired,
  lawTagForm: React.PropTypes.array.isRequired,
  toggleEditMode: React.PropTypes.func.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default LawTag;
