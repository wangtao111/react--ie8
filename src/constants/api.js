
import { define } from './api_helper';

// const url1 = 'http://180.96.11.69:8500';
// const url2 = 'http://180.96.11.73:7272';
// const url3 = 'http://61.155.9.140:6094';
// const url1 = 'http://192.168.11.88:7012';// 倪有发的本地接口IP
// const url2 = 'http://192.168.11.88:7272';// 李惠水的本地接口IP
// const url3 = 'http://192.168.11.88:7095';// 孙艺博接口
const url1 = 'url1';
const url2 = 'url2';
const url3 = 'url3';
const apiObject = {
  decision: {
    province: {
      url: `${url1}/api/decision_result/provinces?axios=1`
    },
    user: {
      url: `${url1}/api/decision_result/users`
    },
    addUser: {
      url: `${url1}/api/decision_result/signup?axios=1`,
      method: 'post'
    },
    modifyUser: {
      url: `${url1}/api/decision_result/user?axios=1`,
      method: 'put'
    },
    deleteUser: {
      url: `${url1}/api/decision_result/user`,
      method: 'delete'
    },
    case: {
      url: `${url2}/api/decision_result/case/data`
    },
    message: {
      url: `${url2}/api/decision_result/case/message`
    },
    options: {
      url: `${url2}/api/decision_result/option_list`
    },
    inputValue: {
      url: `${url2}/api/decision_result/input_value`
    },
    searchTags: {
      url: `${url1}/api/decision_result/search_tags`
    },
    case_list: {
      url: `${url1}/api/decision_result/user_case_info`,
      isFormData: true
    },
    case_list_post: {
      url: `${url1}/api/decision_result/user_case_info?browse_type=IE8`,
      method: 'post',
      isFormData: true
    },
    cases: {
      url: `${url1}/api/decision_result/cases?axios=1`,
      method: 'post'
    },
    caseInfo: {
      url: `${url1}/api/decision_result/szzy/case_deviation_info`
    },
    saveCaseInfo: {
      url: `${url3}/api/plot/edit`
    },
    deleteErr: {
      url: `${url3}/api/err/del`,
      method: 'delete'
    },
    getCaseList: {
      url: `${url1}/api/decision_result/similar_cases`
    },
    caseCauseTags: {
      url: `${url1}/api/decision_result/case_cause_tags`
    },
    newDeviation: {
      url: `${url1}/api/decision_result/new_deviation_predict`
    },
    newSimilar: {
      url: `${url1}/api/decision_result/new_similar_cases`
    },
    delete: {
      url: `${url1}/api/decision_result/user_case_info`,
      method: 'delete',
      isFormData: true
    },
    login: {
      url: `${url1}/api/decision_result/signin?axios=1`,
      method: 'post'
    }
  },
  count: {
    otherCount: {
      url: `${url1}/api/decision_result/new_case_warning_statistic`
    },
    lineCount: {
      url: `${url1}/api/decision_result/new_case_warning_trend_statistic`
    }
  },
  decision_result: {
    data: {
      url: `${url2}/api/decision_result/case/data`
    },
    message: {
      url: `${url2}/api/decision_result/case/message`
    },
    get_check_info: {
      url: `${url2}/api/decision_result/get_check_info`
    },
    get_err: {
      url: `${url2}/api/decision_result/get_checks`
    },
    save_check_info: {
      url: `${url2}/api/decision_result/save_check_info`
    },
    get_laws: {
      url: `${url2}/api/decision_result/get_laws`
    },
    get_red_book: {
      url: `${url2}/api/decision_result/get_red_book`
    },
    get_tags: {
      url: `${url2}/api/decision_result/get_tags`
    }
  }
};
export default define(apiObject);
