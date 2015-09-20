var React = require('react'),
    _ = require('mori'),
    dispatcher = require('../../dispatcher'),
    devState = require('../dev_state'),
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
  maxHeight: '100%',
  overflowY: 'scroll'
}

var DevPanel = React.createClass({
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
  renderActions: function(actions){
    var self = this;
    return actions.map(function(devAction){
      return <ActionItem
        key={devAction.id}
        action={devAction}
        onActionClick={self.onActionClick} />
    });
  },
  render: function(){
    var actions = devState.getActions();
    return (
      <div style={ panelStyle }>
        <DevActions
          onCommit={ this.onActionCommit }
          onUndo={ this.onActionUndo }
          onRedo={ this.onActionRedo }
          onPersistState={ this.onActionPersistState }
          onLoadState={ this.onActionLoadState }/>
        <ul style={ listStyle }>
          { this.renderActions(actions) }
        </ul>
      </div>
    );
  }
});

module.exports = DevPanel;