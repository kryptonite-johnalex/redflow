var atom = require("../lib/atom_state"),
    _ = require("mori"),
    todoActions = require("../config/actions"),
    Dispatcher = require("../lib/dispatcher");

var s = {
  page: ["routes", "page"]
};

module.exports = {
  /** Sets the active page in the atom **/
  setActivePage: Dispatcher.listen(todoActions.SET_PAGE, function(payload) {
    return atom.assocIn(s.page, payload.page);
  }),

  /** Retrives the active page in this specific state **/
  getActivePage: function(state) {
    state = state || atom.get();
    return _.getIn(state, s.page);
  }
};
