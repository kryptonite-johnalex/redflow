"use strict";

/** App Actions **/
module.exports = {
  //Changes the current page
  SET_PAGE: "PAGE:SET",
  //Creates a new todo
  TODO_ADD: "TODO:ADD",
  //Updates a todo's text
  TODO_UPDATE: "TODO:UPDATE",
  //Removes a todo
  TODO_DELETE: "TODO:DELETE",
  //Toggles a todo item's complete status
  TODO_TOGGLE: "TODO:TOGGLE",
  //Toggle all visible todos (not implemented)
  TODO_TOGGLE_ALL: "TODO:TOGGLE:ALL",
  //Removes all completed items
  TODO_CLEAR_COMPLETED: "TODO:CLEAR:COMPLETED"
};