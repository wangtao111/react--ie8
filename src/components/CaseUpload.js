/**
 * Created by Administrator on 2017/4/17.
 */
import React from 'react';
import { HashLocation } from 'react-router';
import Component from '../constants/Component';
import { Upload, Modal, Icon, message } from 'antd';
import '../less/case_upload.less'
const Dragger = Upload.Dragger;

class CaseUpload extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      uploadShow: true
    }
  }
  componentDidMount = () => {
    this.username = 'szzy';
  }
  toggleUploadShow = () => {
    this.setState({
      uploadShow: !this.state.uploadShow
    });
  }
  upload = () => {
    this.setState({
      uploadShow: true
    });
  };
  render = () => {
    const props = {
      name: 'file',
      showUploadList: true,
      multiple: true,
      onChange: (data) => {
        console.log('文书上传返回数据',data);
        if (data.file.response) {
          let id = data.file.response.split(',')[2].split('=')[1];
          let code = parseInt(data.file.response.split(',')[0].split('=')[1]);
          let msg = data.file.response.split(',')[1].split('=')[1];
          if(!code){
            message.success(msg,2);
            HashLocation.push(`/?id=${id}`);
          }else if(code === 2){
            message.warn(msg,5);
          }else if(code === 100){
            message.warn('暂不支持该案由',5);
          }else if(code === 101){
            message.error('解析有误',5)
          }else if(code === 102){
            message.error('当前文书在列表中已存在',5);
            this.props.changeForm(this.state.form);
          }else{
            message.error('上传失败，无响应结果',5);
            console.error(msg);
          }
        }
      },
      action: `http://192.168.11.88:7012/api/decision_result/user_case_info?username=${this.username}&browse_type=IE8`
    };
    return(
      <div id="case_upload_content">
        {this.state.uploadShow ? <div className="case_upload_div">
          <div className="opacity_bg"/>
          <div className="case_upload">
            <div className="max_min_div">
              {/*<div className="close" onClick={this.}><img alt="aegis" src={require('../../assets/home/close.png')} /></div>*/}
            </div>
            <div className="case_upload">
              <Dragger {...props} >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
                <p className="ant-upload-hint">支持单个或批量上传(ie暂不支持批量上传)</p>
                {/*<p className="ant-upload-message" style={{color: '#EBB533'}}>暂支持5类案由的文书上传（包括 盗窃罪、交通肇事罪、故意伤害罪、危险驾驶罪、诈骗罪）</p>*/}
              </Dragger>
            </div>
          </div>
        </div> : null}
      </div>
    )
  }
}
export default CaseUpload;
