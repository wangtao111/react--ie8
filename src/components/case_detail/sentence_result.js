/**
 * Created by Candy on 2017/3/25.
 */
import React from 'react';
import moment from 'moment';
import Component from '../../constants/Component';
import { formatDate } from '../../utils/time-utils';

class SentenceResult extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      SentenceResultForm: {}
    };
  }
  componentWillMount = () => {
    this.componentWillReceiveProps({ SentenceResultForm: this.props.SentenceResultForm });
  }
  componentWillReceiveProps = (nextProps) => {
    const SentenceResultForm = nextProps.SentenceResultForm;
    let mainPunish = '';
    let mainPunishName = '';
    // 初始化主刑下拉列表选项
    if (SentenceResultForm.isLife) {
      mainPunish = 'null';
      mainPunishName = '判处无期徒刑';
    }
    if (SentenceResultForm.deathPenalty) {
      mainPunish = 'null';
      mainPunishName = '死刑';
    }
    if (SentenceResultForm.prisonTerm) {
      mainPunish = SentenceResultForm.prisonTerm * 30;
      mainPunishName = '有期徒刑';
    }
    if (SentenceResultForm.detentionTerm) {
      mainPunish = SentenceResultForm.detentionTerm;
      mainPunishName = '拘役';
    }
    if (SentenceResultForm.control) {
      mainPunish = SentenceResultForm.control;
      mainPunishName = '管制';
    }
    const pre = nextProps.SentenceResultForm;
    // 格式化主刑和缓刑呈现方式
    this.setState({
      SentenceResultForm: Object.assign(pre, { mainPunish, mainPunishName })
    });
  }
  render() {
    const { toggleEditMode, mode } = this.props;
    const { SentenceResultForm } = this.state;
    return (
      <div className="basic_info last_padding">
        <div className="base_info_title clearfix">
          <div>判决结果</div>
          {mode ? <div className="edit" onClick={toggleEditMode.bind(this, 'resultEdit')}>
            <span><img alt="aegis" src={require('../../assets/case_detail/bianji.png')} /></span>
            <span style={{ color: '#21A0FF' }}>编辑</span>
          </div> : null}
        </div>
        <div style={{ background: '#ffffff', padding: '10px 25px' }}>
          <div className="basic_content">
            {
              SentenceResultForm.mainPunish ?
                <div className="tags">
                  { SentenceResultForm.mainPunishName }
                  { SentenceResultForm.mainPunish !== 'null' ?
                    <span><span>:</span><span style={{ color: '#111' }}>&nbsp;{ formatDate(SentenceResultForm.mainPunish) }</span></span> : null
                    }
                </div>
                : null
            }
          </div>
          {SentenceResultForm.fine ? (<div className="basic_content">
            <div className="tags">罚金:
                <span style={{ color: '#111' }}>{SentenceResultForm.fine} 元</span>
            </div>
          </div>) : ''}
          {SentenceResultForm.probationTime ? (<div className="basic_content">
            <div className="tags">缓刑:
                <span style={{ color: '#111' }}>{formatDate(SentenceResultForm.probationTime * 30)}</span>
            </div>
          </div>) : ''}
          {SentenceResultForm.stripPoliticalRights ? (<div className="basic_content">
            <div className="tags">剥夺政治权利时间:
                <span style={{ color: '#111' }}>{SentenceResultForm.stripPoliticalRights === 99 ? '终身' : `${SentenceResultForm.stripPoliticalRights}年` } </span>
            </div>
          </div>) : ''}
          {SentenceResultForm.confiscateProperty ? (<div className="basic_content">
            <div className="tags">没收个人财产</div>
          </div>) : ''}
          {SentenceResultForm.outDay ? (<div className="basic_content">
            <div className="tags">刑期终止日期:
              <span style={{ color: '#111' }}>{moment(SentenceResultForm.outDay).format('YYYY-MM-DD')}</span>
            </div>
          </div>) : ''}
        </div>
      </div>
    );
  }
}
SentenceResult.propTypes = {
  toggleEditMode: React.PropTypes.func.isRequired,
  SentenceResultForm: React.PropTypes.object.isRequired,
  mode: React.PropTypes.bool.isRequired
};
export default SentenceResult;
