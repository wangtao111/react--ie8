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

  }
}
export default ReactComponent;
