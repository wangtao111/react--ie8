/**
 * Created by wuhao on 2017/3/25.
 */
import ReactStore from './ReactStore';

const initstate = {
  pager: {},
  ids: [],
  appRemote: 'http://192.168.11.88:8099',
  countForm: {
    lineDate: {
      start_time: '2016-09',
      end_time: '2017-05'
    },
    otherDate: {
      start_time: '2016-09-01',
      end_time: '2017-05-01'
    }
  },
  form: { username: 'jsgy', sort_type: 0 },
  userForm: {},
  caseId: '',
  casePiece: false,
  showTool: false,
  similarCasePager: { page: 1, page_size: 5 },
  provinces: []
};
const actions = {
  changeName(name, state = initstate) {
    state.name = name;
  }
};
const store = new ReactStore(initstate, actions);
export default store;
