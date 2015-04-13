var debounce = require('./utils').debounce,
    mori = require('mori');

// atom state

var state;
var listeners = [];
var atom;

// some utils

var slice = [].slice;

function wrap(op, args) {
  return mori[op].apply(mori, [atom.get()].concat(args));
}

// simple publisher

var notifySwap = debounce(function(state) {
  for (var i=listeners.length; i--;) listeners[i](state);
}, 10);

// the atom per se

atom = {
  get: function() {
    return state;
  },
  swap: function(newState) {
    this.silentSwap(newState);
    notifySwap(state);
    return newState;
  },
  silentSwap: function(newState) {
    state = newState;
    return newState;
  },
  addChangeListener: function(fn) {
    listeners.push(fn);
  },
  // extend it with some mori ops
  getIn: function() {
    return wrap('getIn', slice.call(arguments));
  },
  assocIn: function() {
    return atom.swap(wrap('assocIn', slice.call(arguments)));
  },
  updateIn: function() {
    return atom.swap(wrap('updateIn', slice.call(arguments)));
  },
  silentAssocIn: function() {
    return atom.silentSwap(wrap('assocIn', slice.call(arguments)));
  },
  silentUpdateIn: function() {
    return atom.silentSwap(wrap('updateIn', slice.call(arguments)));
  }
};

module.exports = atom;
