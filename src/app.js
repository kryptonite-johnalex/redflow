var _ = require("mori"),
    React = require("react"),
    atom = require("./lib/atom_state"),
    page = require("page"),
    routes = require("./routes"),
    initialState = require("./config/initial_state"),
    RootComponent = require("./components/root");


window.onload = function() {
  // initialize initial state on atom
  atom.silentSwap(_.toClj(initialState));
  window.atom = atom;
  // set subdomain
  page.base(window.location.pathname);

  //initialize router
  for (var route in routes) if (routes.hasOwnProperty(route)) {
    page.apply(null, [route].concat(routes[route]));
  };
  page({hashbang: true});

  setTimeout(React.render.bind(React, (<RootComponent/>), document.body), 100);
};
