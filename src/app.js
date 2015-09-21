var _ = require("mori"),
    React = require("react"),
    atom = require("./lib/atom_state"),
    //devtools - import before any other store or router
    DevTools = require('./lib/devtools'),
    DevPanel = DevTools.DevPanel,
    page = require("page"),
    routes = require("./routes"),
    initialState = require("./config/initial_state"),
    RootComponent = require("./components/root"),
    TodoStore = require("./stores/todos");


window.onload = function() {
  // initialize initial state on atom
  atom.swap(_.toClj(initialState));
  /** UNCOMMENT FOR DEBUGGING **/
  // window.atom = atom;
  // window._ = _;
  /** REMOVE ABOVE LINES IN PRODUCTION!!! **/
  DevTools.commit();

  // set subdomain
  page.base(window.location.pathname);

  //initialize router
  for (var route in routes) if (routes.hasOwnProperty(route)) {
    page.apply(null, [route].concat(routes[route]));
  };

  //Uncomment for hash-based navigation, otherwise HTML5 History API will be used
  page({hashbang: true});

  //Start routing
  page();

  React.render(<RootComponent/>, document.getElementById("todoapp"));

  //DEBUG ONLY render devpanel
  React.render(<DevPanel collapsed={true}/>, document.getElementById("devtools"));

  //just for debugging, add 1000 random todo items :)
  //we're not using an Action because this is an internal hack
  //TodoStore.addRandomItems();
};
