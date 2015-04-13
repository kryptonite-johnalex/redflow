var page = require("page"),
    _ = require("mori"),
    atom = require("./lib/atom_state"),
    DispatcherMessages = require("./lib/dispatcher").messages,
    emit = require("./lib/dispatcher").emit;


function setPage(page) {
  return function(ctx, next) {
    ctx.handled = true;
    emit(DispatcherMessages.SET_PAGE, page);
    next();
  }
}


module.exports = {
  "": [setPage("main")]
};
