var EventEmitter = require('eventemitter2').EventEmitter2,
    atom = require("./atom_state");

var dispatcher = new EventEmitter({
  wildcards: true,
  delimiter: ':',
  newListener: false,
  maxListeners: 10
});

dispatcher.listen = function(event, fn) {
  if (event instanceof Array) {
    event.map(function(e) {
      dispatcher.on(e, fn);
    })
  } else {
    dispatcher.on(event, fn);
  }
  return fn;
};

dispatcher.sender = function(event) {
  var args1 = Array.prototype.slice.call(arguments);
  return function(e) {
    e.preventDefault();
    var args2 = Array.prototype.slice.call(arguments);
    dispatcher.emit.apply(dispatcher, args1.concat(args2));
  };
};

dispatcher.messages = {
  SET_PAGE: "PAGE:SET"
}

//dispatcher.emit = dispatcher.emit.bind(dispatcher);

// just for debug. uncomment prev line and remove this for prod.
dispatcher.emit = (function(emit) {
  return function() {
    var args = [].slice.call(arguments);
    if(!args[0]) {
      throw new Error('Dispatcher.emit without message');
    }
    //console.log.apply(console, ['dispatching: '].concat(args));
    return emit.apply(dispatcher, args);
  };
})(dispatcher.emit);

module.exports = dispatcher;
