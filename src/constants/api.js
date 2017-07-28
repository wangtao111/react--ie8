
import { define } from './api_helper';
const url = "http://192.168.11.154:8081";
const apiObject = {
  user:{
    login:{
      url: `${url}/login`,
      method: 'post'
    },
    get_user_msg:{
      url:`${url}/get_user_msg`
    },
    province: {
      url: `http://192.168.11.88:7012/api/decision_result/provinces?axios=1`
    },
    add_user: {
      url: `${url}/add_user`
    }
  }
};
export default define(apiObject);
