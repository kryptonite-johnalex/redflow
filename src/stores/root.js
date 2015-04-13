var atom = require("../lib/atom_state"),
    _ = require("mori"),
    dispatcherMessages= require("../lib/dispatcher").messages,
    listen = require("../lib/dispatcher").listen;

var s = {
  page: ['routes', 'page']
};

module.exports = {
  setActivePage: listen(dispatcherMessages.SET_PAGE, function(page) {
    atom.assocIn(s.page, page);
  }),
  getActivePage: function(state) {
    state = state || atom.get();
    return _.getIn(state, s.page);
  }
}
