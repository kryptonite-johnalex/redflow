var React = require('react');


var collapsedStyle = {
  zIndex: 1000,
  backgroundColor: '#234',
  color: '#fff',
  position: 'absolute',
  //dock right
  height: '100%',
  top: 0,
  right: 0,
  bottom: 0,
  width: '50px',
  overflowX: 'hidden',
  overflowY: 'hidden',
  cursor: 'pointer'
};

var handleStyle = {
  transform: 'rotate(-90deg)',
  transformOrigin: '50% 100%',
  textWrap: 'no-wrap',
  verticalAlign: 'middle'
}

var CollapsedPanel = React.createClass({
  propTypes: {
    handleText: React.PropTypes.string,
    onPanelClick: React.PropTypes.func.isRequired
  },
  getDefaultProps: function() {
    return {
      handleText: 'Show'
    };
  },
  render: function(){
    return (
      <div style={collapsedStyle} onClick={this.props.onPanelClick}>
        <div style={handleStyle}>{this.props.handleText}</div>
      </div>
    );
  }
});

module.exports = CollapsedPanel;