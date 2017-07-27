/**
 * Created by wuhao on 2017/3/25.
 */
import React from 'react';
import moment from 'moment';
import { HashLocation } from 'react-router';
import { RangePicker } from 'antd/lib/date-picker';
import { Form, DatePicker, Upload, Modal, Icon, message, Select, Input } from 'antd';
import Component from '../../constants/Component';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
class Title extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      form: {},
      start_time: null,
      end_time: null,
      cancel: true,
      user_mode: 1,
      timeOption: new Date(),
      options: {
        case_cause_id: 0
      },
      courtList: [],
      causeList: [
        { id: 1, name: '刑事案' },
        { id: 2, name: '民事案' }
      ],
      procuratorateList: [],
      docType: [
        { name: '全部', id: '' },
        { name: '判决书', id: 1 },
        { name: '公诉书', id: 7 }
      ],
      visible: false,
      caseContent: ''
    };
    this.start_time = null;
    this.end_time = null;
    this.provinceId = 3;
  }
  componentWillReceiveProps = (nextProps) => {

  }
  componentDidMount = () => {
    this.setState({form: this.$store.state.form});
    this.$store.state.form.username === 'jsgy' || this.$store.state.form.username === 'xmzy' ? this.setState({ user_mode: 1 }) : this.setState({ user_mode: 2 });
  };
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
  toCount = () => {
    HashLocation.push('/count');
  };
  handlePredict = () => {
    console.log(this.state.caseContent,88888888);
    this.$api.decision.case_list_post.request({content: this.state.caseContent, username: this.$store.state.form.username}).then((response) => {
      this.setState({visible: false});
      console.log("解析结果", response.data);
      if(response.data){
        let id = response.data.split(',')[2].split('=')[1];
        let code = parseInt(response.data.split(',')[0].split('=')[1]);
        let msg = response.data.split(',')[1].split('=')[1];
        if(!code){
          message.success('解析成功！',2);
          HashLocation.push(`/case_warning?id=${id}&casePieces=1`);
        }else if(code === 2){
          alert(msg);
        }else if(code === 100){
          alert('暂不支持该案由');
        }else if(code === 101){
          alert('解析有误')
        }else if(code === 102){
          HashLocation.push(`/case_warning?id=${id}&casePieces=1`);
        }else{
          alert('上传失败，无响应结果');
          console.error(msg);
        }
      }
    });
  };
  handleCancel = () => {
    this.setState({visible: false});
  };


  render = () => {
    const props = {
      name: 'file',
      showUploadList: true,
      multiple: true,
      onChange: (data) => {
        console.log('文书上传返回数据',data);
        console.log('文书上传路径', `192.17012/api/decision_result/user_case_info?username=${this.$store.state.form.username}&browse_type=IE8`);
        console.log('文书上传返回数据',data);
        if (data.file.response) {
          let id = data.file.response.split(',')[2].split('=')[1];
          let code = parseInt(data.file.response.split(',')[0].split('=')[1]);
          let msg = data.file.response.split(',')[1].split('=')[1];
          if(!code){
            message.success('上传成功！',2);
            this.props.changeForm(this.state.form);
          }else if(code === 2){
            alert(msg);
          }else if(code === 100){
            alert('暂不支持该案由');
          }else if(code === 101){
            alert(msg)
          }else if(code === 102){
            alert('当前文书在列表中已存在');
            this.props.changeForm(this.state.form);
          }else{
            alert('上传失败，无响应结果');
            console.error(msg);
          }
          this.setState({
            uploadShow: false
          });
        }
      },
      action: `url1/api/decision_result/user_case_info?username=${this.$store.state.form.username}&browse_type=IE8`
    };
    const Option = Select.Option;
    const { form, uploadShow } = this.state;
    return (<div className="title_div">
      <div className="title_content">
        {
          this.$store.state.form.username === 'jsgy' || this.$store.state.form.username === 'admin'?<div className="to_count" onClick={this.toCount.bind(this)}>《 返回 </div>:null
        }
        <div className="upload_btn" onClick={this.upload}>文书上传</div>
        <div className="predict_punish" onClick={() =>{this.setState({visible: true})}}>
          研判分析
        </div>
        <div className="search_case">
          <Input
                 id="search_case_input"
                 value={form.name}
                 onChange={
                   (e) => {
                       this.setState({
                         form: Object.assign(this.state.form, { name: e.target.value })
                       });
                     }
                   }
                 onKeyUp={
                     (e) => {
                       e.preventDefault();
                       this.$store.state.form.page = 1;
                       e.keyCode === 13 && this.props.changeForm({name: this.state.form.name});
                     }
                   }
                 placeholder="搜索文书名称或案号"
                 size="large"/>
           <div onClick={
             (e) => {
               e.preventDefault();
               this.$store.state.form.page = 1;
               this.props.changeForm({name: this.state.form.name});
             }
           }>
             搜索
           </div>
        </div>
        <Modal visible={this.state.visible} width={'60%'} className="Analysis_dialog"
               onOk={this.handlePredict.bind(this)} onCancel={this.handleCancel.bind(this)}>
            <div className="input_dialog">
              <p className="dialog_title">
                研判分析 <i onClick={this.handleCancel.bind(this)}></i>
              </p>
              <div className="copy_content">

              </div>
              <p className="input-inner">
                {/*<span style={{fontSize: '16px', color: '#EBB533'}}>暂支持5类案由的文书粘贴（包括 盗窃罪、交通肇事罪、故意伤害罪、危险驾驶罪、诈骗罪）</span>*/}
                <Input type="textarea" id="case_input" placeholder='请复制您的文书内容到文本框' value={this.state.caseContent} onChange={(e) => {
                  this.setState({caseContent: e.target.value});
                }}/>
              </p>
            </div>
        </Modal>
      </div>
      {uploadShow ? <div className="upload_div">
        <div className="opacity_bg" onClick={this.toggleUploadShow} />
        <div className="upload">
          <div className="max_min_div">
            <div className="close" onClick={this.toggleUploadShow}><img alt="aegis" src={require('../../assets/home/close.png')} /></div>
          </div>
          <div className="upload">
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
    </div>);
  }
}
Title.propTypes = {
  changeForm: React.PropTypes.func.isRequired,
  options: React.PropTypes.object.isRequired,
  form: React.PropTypes.object.isRequired
};
export default Title;
