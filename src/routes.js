var page = require("page"),
    _ = require("mori"),
    atom = require("./lib/atom_state"),
    Actions = require("./config/actions"),
    Dispatcher = require("./lib/dispatcher");


function setPage(page) {
  return function(ctx, next) {
    console.log('Routes setPage', page);
    ctx.handled = true;
    Dispatcher.emit(Actions.SET_PAGE, { page: page });
    next();
  }
}


module.exports = {
  "": [setPage("all")],
  "active": [setPage("active")],
  "completed": [setPage("completed")]
};
