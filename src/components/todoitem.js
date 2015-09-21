"use strict";
var React = require("react"),
    Dispatcher = require("../lib/dispatcher"),
    _ = require("mori"),
    TodoActions = require("../config/actions");


var ENTER_KEY_CODE = 13,
    ESCAPE_KEY_CODE = 27;

var TodoItem = React.createClass({
  /**
  Defining expected 'props' will display warn messages
  if missing or wrong types are configured for an instance
  of this component. Pretty useful.
  **/
  propTypes: {
    todo: React.PropTypes.object.isRequired
  },
  /** React calls this function on first mount **/
  getInitialState: function() {
    return {
      text: _.get(this.props.todo, "text"),
      isEditing: false
    };
  },
  /**
  IMPORTANT - even with React not really updating the DOM
  unless it's changed, we should prevent computing the render
  function if we know that this component will not change.
  This is specially important when a component is a "list item"
  like this one. React will update a big list 5x faster when
  this lifecycle method is implemented.
  **/
  shouldComponentUpdate: function(nextProps, nextState) {
    return !_.equals(this.props.todo, nextProps.todo) ||
      this.state !== nextState;
  },
  //this added only for devtools demo
  componentWillReceiveProps: function(nextProps) {
    this.setState({ text: _.get(nextProps.todo, "text") });
  },
  /**
  When an update occurs because of this.setState() calls or
  because the previos predicate returned true, React will
  notify the component via this method. In this case, we
  use it to set the input focus if in editing mode
  **/
  componentDidUpdate: function(prevProps, prevState) {
    if(this.state.isEditing){
      this.refs.input.getDOMNode().focus();
    }
  },
  //Handles double click event on input
  onDoubleClick: function(e){
    e.preventDefault();
    this.setState({ isEditing: true });
  },
  //Handles complete/uncomplete toggle click event
  onToggleClick: function(e){
    this._toggle();
  },
  //Handles the destroy button click event
  onDestroyClick: function(e){
    this._destroy();
  },

  /**
  This is a React "controlled component". Because we set
  a value property in the render method, if don't ever change
  that value, the user won't be able to modify the input element
  as React will rewrite its value.

  For these cases, we use the component internal state.
  The getInitialState() should configure the "default value", and
  then the change event handler will update this component state,
  NOT the original data used to set that initial state.
  **/
  onInputChange: function(e){
    this.setState({ text: e.target.value });
  },

  onKeyUp: function(e){
    if (e.keyCode === ENTER_KEY_CODE) {
      this._save(e.target.value.trim());
    }
    if(e.keyCode == ESCAPE_KEY_CODE){
      this._cancelEdit();
    }
  },
  render: function(){
    var todo = this.props.todo,
        todoText = _.get(todo, "text"),
        isCompleted = _.get(todo, "completed"),
        liClass = this.state.isEditing? "editing": "";

    liClass += isCompleted ? " completed": "";

    return (
      <li className={liClass}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={isCompleted} onChange={this.onToggleClick} />
          <label onDoubleClick={this.onDoubleClick}>{todoText}</label>
          <button className="destroy" onClick={this.onDestroyClick}></button>
        </div>
        <input ref="input" className="edit"
          value={this.state.text}
          onChange={this.onInputChange}
          onKeyUp={this.onKeyUp}
           />
      </li>
    );
  },
  _save: function(newText){
    var todoId = _.get(this.props.todo, "id");
    Dispatcher.emit(TodoActions.TODO_UPDATE, { id: todoId, text: newText });
    this.setState({
      isEditing: false
    });
  },
  _cancelEdit: function(){
    this.setState({
      isEditing: false
    });
  },
  _toggle: function(){
    var todoId = _.get(this.props.todo, "id");
    Dispatcher.emit(TodoActions.TODO_TOGGLE, { id: todoId });
  },
  _destroy: function(){
    var todoId = _.get(this.props.todo, "id");
    Dispatcher.emit(TodoActions.TODO_DELETE, { id: todoId });
  }
});

module.exports = TodoItem;