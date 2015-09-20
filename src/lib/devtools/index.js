var devToolsState = require('./dev_state');

devToolsState.setup();

module.exports = {
  DevPanel: require('./components/index'),
  commit: devToolsState.commit
}