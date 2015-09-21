var React = require('react'),
    _ = require('mori'),
    devState = require('../dev_state');


var panelStyle = {
  background: '#567',
  padding: '4px'
}

var buttonStyle = {
  display: 'inline-block',
  background: '#345',
  fontWeight: 'bold',
  color: '#fff',
  padding: '4px',
  marginRight: '4px',
  cursor: 'pointer'
}

var DevActions = React.createClass({
  handleCommit: function(e){
    e.preventDefault();
    devState.commit();
  },

  handleUndo: function(e){
    e.preventDefault();
    this.props.onUndo();
  },

  handleRedo: function(e){
    e.preventDefault();
    this.props.onRedo();
  },

  handlePersist: function(e){
    e.preventDefault();
    this.props.onPersistState();
  },

  handleLoad: function(e){
    e.preventDefault();
    this.props.onLoadState();
  },

  render: function(){
    var actions = devState.getActions(),
        stackEmpty = _.count(actions) === 0;
    return (
      <div style={panelStyle}>
        <button style={buttonStyle} onClick={this.handleCommit}>COMMIT</button>
        <button style={buttonStyle} onClick={this.handleUndo}>UNDO</button>
        <button style={buttonStyle} onClick={this.handleRedo}>REDO</button>

        <button style={buttonStyle} onClick={this.handlePersist}>PERSIST STATE</button>
        <button style={buttonStyle} onClick={this.handleLoad}>LOAD STATE</button>
        <button style={buttonStyle} onClick={this.props.onHideClick}>HIDE &gt;</button>
      </div>
    );
  }
});
module.exports = DevActions;