'use strict';
var React = require('react'),
    _ = require('mori'),
    dispatcher = require('../../dispatcher'),
    devState = require('../dev_state'),
    CollapsedPanel = require('./collapsed'),
    DevActions = require('./dev_actions'),
    ActionItem = require('./action_item');

var panelStyle = {
  zIndex: 1000,
  backgroundColor: '#234',
  color: '#fff',
  position: 'absolute',
  //dock right
  width: '25%',
  height: '100%',
  top: 0,
  right: 0,
  bottom: 0,
  overflowY: 'hidden'
}

var listStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  maxHeight: '99%',
  paddingBottom: '10px',
  overflowY: 'scroll'
}

var DevPanel = React.createClass({
  getDefaultProps: function() {
    return {
      collapsed: false
    };
  },
  getInitialState: function() {
    return {
      collapsed: this.props.collapsed
    };
  },
  componentDidMount: function() {
    devState.addChangeListener(this.forceUpdate.bind(this));
  },
  onActionClick: function(action){
    devState.toggleAction(action);
  },
  onActionCommit: function(){
    dispatcher.emit(devState.actionTypes.DEV_COMMIT);
  },
  onActionUndo: function(){
    dispatcher.emit(devState.actionTypes.DEV_UNDO);
  },
  onActionRedo: function(){
    dispatcher.emit(devState.actionTypes.DEV_REDO);
  },
  onActionPersistState: function(){
    dispatcher.emit(devState.actionTypes.DEV_PERSIST);
  },
  onActionLoadState: function(){
    dispatcher.emit(devState.actionTypes.DEV_LOAD);
  },
  onActionHide: function(e){
    e.preventDefault();
    this.setState({ collapsed: true });
  },
  onCollapsedPanelClick: function(e){
    e.preventDefault();
    this.setState({ collapsed: false });
  },
  renderActions: function(actions){
    var self = this;
    return actions.map(function(devAction){
      return <ActionItem
        key={devAction.id}
        action={devAction}
        onActionClick={self.onActionClick} />
    });
  },
  renderFullPanel: function(){
    var actions = devState.getActions();
    return (
      <div style={ panelStyle }>
        <DevActions
          onCommit={ this.onActionCommit }
          onUndo={ this.onActionUndo }
          onRedo={ this.onActionRedo }
          onPersistState={ this.onActionPersistState }
          onLoadState={ this.onActionLoadState }
          onHideClick={ this.onActionHide } />
        <ul style={ listStyle }>
          { this.renderActions(actions) }
        </ul>
      </div>
    );
  },
  renderCollapsedPanel: function(){
    return <CollapsedPanel onPanelClick={ this.onCollapsedPanelClick } />;
  },
  render: function(){
    var isCollapsed = this.state.collapsed;
    if(isCollapsed){
      return this.renderCollapsedPanel();
    }
    else {
      return this.renderFullPanel();
    }
  }
});

module.exports = DevPanel;