var React = require("react"),
    atom = require("../lib/atom_state"),
    rootStore = require("../stores/root"),
    layouts = {
      main: require("./layouts/main"),
    };

var Root = React.createClass({
  componentDidMount: function() {
    atom.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.forceUpdate();
  },
  render: function() {
    var state = atom.get(),
        currentPage = rootStore.getActivePage(state),
        Layout = layouts[currentPage];
    return (<Layout state={state}/>);
  }
});

module.exports = Root;
