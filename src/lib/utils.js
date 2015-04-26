var _ = require('mori');

var slice = Array.prototype.slice;

module.exports = {
  throttle: function(f, delay){
      var timer = null;
      return function(){
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = window.setTimeout(function(){
              f.apply(context, args);
          },
          delay || 500);
      };
  },
  debounce: function(fn, ms) {
    var id = 0;
    return function() {
      var args = arguments, ctx = this;
      clearTimeout(id);
      id = setTimeout(function() { fn.apply(ctx, arguments); }, ms);
    };
  },
  extend: function(obj) {
    var args = slice.call(arguments, 1);
    return args.reduceRight(function(acc, el) {
      for (var k in el) if (el.hasOwnProperty(k)) acc[k] = el[k];
      return acc;
    }, obj);
  },
  curry2: function(fn) {
    return function() {
      var fixedArgs = slice.call(arguments);
      return function() {
        var args = slice.call(arguments);
        return fn.apply(this, fixedArgs.concat(args));
      };
    };
  },
  range: function (from, to) {
    var range = [];
    for (var i = from - 1; ++i < to;) range.push(i);
    return range;
  },
  partitionAll: function (list, size) {
    var partition = [];
    for (var i = 0, ln = list.length; i < ln; i += size) partition.push(list.slice(i, i + size));
    return partition;
  },
  mapTimes: function (mapper, times) {
    var timesArr = [];
    for (var i = 0; i++ < times;) timesArr.push(0);
    return timesArr.map(mapper);
  },
  compose: function() {
    var funcs = arguments;
    return function() {
        var args = arguments;
        for (var i = funcs.length; i --> 0;) {
            args = [funcs[i].apply(this, args)];
        }
        return args[0];
    }
  },
  // mori
  removeElement: function(e) {
    return _.partial(_.remove, _.partial(_.equals, e));
  },
  replaceElement: function(old, current) {
    return _.partial(_.map, function(e) {
      return (_.equals(old, e)? current : e);
    });
  },
  not: function(p) {
    return function() { return !p.apply(this, arguments); };
  },
  times: function(n, fn) {
    var results = [];
    for (var i = 0; i < n; i++) {
      results.push(fn(i));
    }
    return results;
  }
};
