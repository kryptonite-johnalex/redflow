var React = require("react"),
    atom = require("../lib/atom_state"),
    rootStore = require("../stores/root"),
    Dispatcher = require("../lib/dispatcher"),
    Actions = require("../config/actions"),
    layouts = {
      main: require("./layouts/main"),
    };

var beginUpdate;

var Root = React.createClass({
  componentDidMount: function() {
    //react to any changes in atom :)
    atom.addChangeListener(this._onChange);
    //Load todo-items
    Dispatcher.emit(Actions.TODO_LOAD);
  },
  _onChange: function() {
    //for performance purposes
    //beginUpdate = +new Date();
    this.forceUpdate();
  },
  //Just for debugging - measure full re-render time
  componentDidUpdate: function(prevProps, prevState) {
    //console.log("Update done in ", +new Date()-beginUpdate, "ms");
  },
  render: function() {
    var state = atom.get(),
        currentPage = rootStore.getActivePage(state),
        Layout = layouts.main;
    return (
      <div>
        <Layout state={state}/>
      </div>
    );
  }
});

module.exports = Root;
