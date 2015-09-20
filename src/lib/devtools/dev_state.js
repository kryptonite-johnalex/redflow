var _ = require('mori'),
    atom = require('../atom_state'),
    dispatcher = require('../dispatcher');

var localStorageKey = '@@REDFLOW_DEVTOOLS';

var devActions = {
  DEV_COMMIT: '@@DEV_COMMIT',
  DEV_SKIP: '@@DEV_SKIP',
  DEV_APPLY: '@@DEV_TOGGLE',
  DEV_COMMIT: '@@DEV_COMMIT',
  DEV_UNDO: '@@DEV_UNDO',
  DEV_REDO: '@@DEV_REDO',
  DEV_PERSIST: '@@DEV_PERSIST',
  DEV_LOAD: '@@DEV_LOAD'
}

var actions = _.vector();
var listeners = [];
var lastState;
var initialState;
var _rebuilding = false;

function notify(){
  listeners.forEach(function(cb){
    cb();
  });
}

function getStateDiff(state){
  if(!lastState){
    lastState = state;
    return lastState;
  }
  else {
    var diff = _.hashMap();
    _.each(_.keys(state), function(key){
      var val = _.get(state, key);
      if(!_.equals(val, _.get(lastState, key))){
        diff = _.assoc(diff, key, _.get(state, key));
      }
    });
    lastState = state;
    return diff;
  }
}

function isDevAction(type){
  return type.indexOf('@@DEV_') === 0;
}

function interceptDispatcher(){
  var _emit = dispatcher.emit.bind(dispatcher);

  dispatcher.emit = function(type, originalAction){
    if(type === 'newListener' || isDevAction(type) || _rebuilding){
      _emit(type, originalAction);
      return;
    }
    // create a replayable action
    var action = {
      id: _.count(actions),
      type: type,
      action: originalAction,
      skip: false,
      prevState: atom.get(),
      error: null,
      postState: null,
      diff: null
    };
    // dispatch original
    try {
      _emit(type, originalAction);
    }
    catch(err){
      action.error = err;
    }
    finally {
      action.postState = atom.get();
      action.diff = getStateDiff(action.postState);
      actions = _.conj(actions, action);
      notify();
    }
  }
}

function rebuildState(){
  atom.silentSwap(initialState);
  _rebuilding = true;
  _.each(actions, function(replayableAction){
    if(!replayableAction.skip){
      dispatcher.emit(replayableAction.type, replayableAction.action);
    }
  });
  _rebuilding = false;
  //force ui update
  atom.swap(atom.get());
}

module.exports = {
  getActions: function(){
    return _.intoArray(_.reverse(actions));
  },
  toggleAction: dispatcher.listen(devActions.DEV_TOGGLE, function(action){
    if(action.skip){
      this.applyAction(action);
    }
    else {
      this.skipAction(action);
    }
  }),
  applyAction: dispatcher.listen(devActions.DEV_APPLY, function(payload){
    var id = payload.id;
    var action = _.nth(actions, id);
    console.log('Commit action', action.id, action.type, action.action);
    action.skip = false;
    actions = _.assoc(actions, id, action);
    rebuildState();
    notify();
  }),
  skipAction: dispatcher.listen(devActions.DEV_SKIP, function(payload){
    var id = payload.id;
    var action = _.nth(actions, id);
    console.log('Skip action', action.id, action.type, action.action);
    action.skip = true;
    actions = _.assoc(actions, id, action);
    rebuildState();
    notify();
  }),

  //stores current atom as initialState for replay
  commit: dispatcher.listen(devActions.DEV_COMMIT, function(){
    console.log('DevState - initialState updated');
    initialState = atom.get();
    actions = _.vector();
    notify();
  }),

  //undo last action
  undo: dispatcher.listen(devActions.DEV_UNDO, function(){
    var lastAction = _.last(_.filter(function(a){
      return a.skip === false;
      },actions));
    if(lastAction){
      dispatcher.emit(devActions.DEV_SKIP, lastAction);
    }
  }),

  redo: dispatcher.listen(devActions.DEV_REDO, function(){
    var lastAction = _.first(_.filter(function(a){
      return a.skip === true;
      }, actions));
    if(lastAction){
      dispatcher.emit(devActions.DEV_APPLY, lastAction);
    }
  }),

  persistState: dispatcher.listen(devActions.DEV_PERSIST, function(){
    var currentState = atom.get();
    if(localStorage){
      localStorage.setItem(localStorageKey, JSON.stringify(_.toJs(currentState)));
    }
  }),

  loadState: dispatcher.listen(devActions.DEV_LOAD, function(){
    if(localStorage){
      var restoredState = localStorage.getItem(localStorageKey);
      if(restoredState){
        var state = JSON.parse(restoredState);
        initialState = _.toClj(state);
        atom.swap(initialState);
      }
    }
  }),

  actionTypes: devActions,
  addChangeListener: function(cb){
    listeners.push(cb);
  },
  setup: function(){
    interceptDispatcher();
  }
}