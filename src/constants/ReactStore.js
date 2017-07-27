/**
 * Created by wuhao on 2017/3/25.
 */
import ObjectAssign from 'object-assign';

class ReactStore {
  constructor(state, actions) {
    this.state = state;
    this.actions = actions;
    this.components = [];
  }

  setState(states) {
    ObjectAssign(this.state, states);
    if (this.components) {
      this.components.forEach((component) => {
        component.setState({});
      });
    }
  }
}

export default ReactStore;
