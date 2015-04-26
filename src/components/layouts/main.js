"use strict";
var React = require("react"),
    Header = require("../header"),
    TodoList = require("../todolist"),
    Footer = require("../footer");

var MainLayout = React.createClass({
  render: function() {
    var s = this.props.state;
    return (
      <div>
        <Header state={s} />
        <TodoList state={s} />
        <Footer state={s} />
      </div>
    );
  }
})

module.exports = MainLayout;
