"use strict";
var React = require("react"),
    _ = require("mori"),
    RootStore = require("../stores/root"),
    TodoStore = require("../stores/todos"),
    TodoItem = require("./todoitem");

var TodoList = React.createClass({
  propTypes: {
    state: React.PropTypes.object.isRequired
  },
  /**
  Renders the list of items corresponding to the current view / active page.
  This probably is a bit too core-related to be here in the View code, but
  for this simple example it's OK. If we move this to the TodosStore, we'll
  need to get a dependency on the RootStore there.
  **/
  renderItemsForPage: function(state, page){
    var itemVector;
    switch(page){
    case "all":
      itemVector = TodoStore.getAllItems(state);
      break;
    case "active":
      itemVector = TodoStore.getActiveItems(state);
      break;
    case "completed":
      itemVector = TodoStore.getCompletedItems(state);
      break;
    }
    /**
    IMPORTANT
    mori's map() doesn't return a Javascript array but a mori
    Seq collection. ANY TIME you use map() you need to convert
    it into a JS array so that React can iterate it.
    If you fail to do this, you'll see strange numbers instead of
    your list in your browser. :)
    **/
    return _.intoArray(_.map(function(item){
      return (
        <TodoItem key={_.get(item, "id")} todo={item} />
      );
    }, itemVector));
  },
  render: function(){
    var s = this.props.state,
        activePage = RootStore.getActivePage(s),
        items = this.renderItemsForPage(s, activePage);

    return (
      <div id="main">
        <ul id="todo-list">
          {items}
        </ul>
      </div>
    );
  }
});

module.exports = TodoList;