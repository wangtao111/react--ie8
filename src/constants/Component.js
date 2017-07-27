/**
 * Created by wuhao on 2017/3/23.
 */
import {Component} from 'react';
import api from '../constants/api';
import store from './Store';

class ReactComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.$api = api;
    this.$store = store;
    this.$store.components.push(this);
  }
  componentWillMount = () => {
    if (localStorage.userMsg) {
      const userMsg = JSON.parse(localStorage.userMsg);
      if (userMsg.username !== 'jsgy' && userMsg.username !== 'xmzy') {
        document.title = '量刑建议智能决策辅助系统';
      } else {
        document.title = '同案不同判预警系统';
      }
    }
  }
}
export default ReactComponent;
