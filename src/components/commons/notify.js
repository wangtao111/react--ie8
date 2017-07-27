import notification from 'antd/lib/notification';
import Component from '../../constants/Component';

function show(text) {
  notification.open({
    message: '提示',
    description: text
  });
}

class Notify extends Component {
  render() {
    return null;
  }
}
export default Notify;
export const notify = {
  show
};
