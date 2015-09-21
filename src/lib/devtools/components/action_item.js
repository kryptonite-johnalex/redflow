var _ = require('mori'),
    React = require('react'),
    JSONTree = require('react-json-tree');

var errorStyle = {
  background: '#c00',
  color: '#fff',
  padding: '8px',
  fontSize: 14
};

var ActionItem = React.createClass({
  propTypes: {
    action: React.PropTypes.object.isRequired,
    onActionClick: React.PropTypes.func.isRequired
  },
  onActionTypeClick: function(e){
    e.preventDefault();
    this.props.onActionClick(this.props.action);
  },
  renderActionData: function(a){
    if(a.skip) return (null);
    return (
      <div>
        <JSONTree keyName='action' data={a.action || {} } />
        <JSONTree keyName='changed' data={_.toJs(a.diff) } />
        <JSONTree keyName='state' data={_.toJs(a.postState) } />
      </div>
    );
  },
  renderActionError: function(a){
    return (
      <div style={errorStyle}>
        { a.error.message }
        <hr />
        { a.error.stack }
      </div>
    )
  },
  render: function(){
    var titleStyle = {
      background: '#123',
      margin: 0,
      marginBottom: '4px',
      padding: '4px',
      cursor: 'pointer',
      textDecoration: this.props.action.skip ? 'line-through':'none'
    };
    var a = this.props.action;
    return (
      <li>
        <h3 style={titleStyle} onClick={ this.onActionTypeClick }>
          { a.type }
        </h3>
        { a.error ? this.renderActionError(a) : this.renderActionData(a) }
      </li>
    )
  }
});

module.exports = ActionItem;