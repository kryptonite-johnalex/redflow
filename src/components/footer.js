var React = require("react"),
    Dispatcher = require("../lib/dispatcher"),
    TodoActions = require("../config/actions"),
    RootStore = require("../stores/root"),
    TodoStore = require("../stores/todos");

module.exports = React.createClass({
  onClearCompletedClick: function(e){
    e.preventDefault();
    Dispatcher.emit(TodoActions.TODO_CLEAR_COMPLETED);
  },
  render: function(){
    var currentPage = RootStore.getActivePage(this.props.state),
        activeItemCount = TodoStore.getActiveItemCount(this.props.state);

    return (
      <footer id="footer">
        <span id="todo-count"><strong>{activeItemCount}</strong> items left</span>
        <ul id="filters">
          <li><a href="/" className={ currentPage === "all"? "selected" : ""}>All</a></li>
          <li><a href="/active" className={ currentPage === "active"? "selected" : ""}>Active</a></li>
          <li><a href="/completed" className={ currentPage === "completed"? "selected" : ""}>Completed</a></li>
        </ul>
        <button id="clear-completed" onClick={this.onClearCompletedClick}>Clear completed</button>
      </footer>
    );
  }
});