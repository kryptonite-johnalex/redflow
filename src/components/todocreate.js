"use strict";
var React = require("react"),
    Dispatcher = require("../lib/dispatcher"),
    Actions = require("../config/actions"),
    TodoStore = require("../stores/todos");

var ENTER_KEY_CODE = 13,
    ESCAPE_KEY_CODE = 27;

var TodoCreate = React.createClass({
  /** As soon as this component is mounted into the DOM, set input focus **/
  componentDidMount: function() {
    this.refs.newTodo.getDOMNode().focus();
  },
  onKeyUp: function(e){
    //Save on ENTER
    if(e.keyCode === ENTER_KEY_CODE){
      this._save(e.target.value.trim());
      e.target.value = '';
    }
    //Cancel on ESC
    if(e.keyCode === ESCAPE_KEY_CODE){
      e.target.value = '';
    }
  },
  render: function(){
    return (
      <input id="new-todo" ref="newTodo"
        placeholder="What needs to be done?"
        onKeyUp={this.onKeyUp} />
    );
  },
  _save: function(todoText){
    Dispatcher.emit(Actions.TODO_ADD, { text: todoText });
  }
});

module.exports = TodoCreate;