"use strict";
var React = require("react"),
    TodoCreate = require("./todocreate");

module.exports = React.createClass({
  propTypes: {
    state: React.PropTypes.object.isRequired
  },
  render: function(){
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoCreate state={this.props.state} />
      </header>
    );
  }
});