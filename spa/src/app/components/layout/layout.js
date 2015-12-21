let Header = React.createClass({
  render() {
    return (
      <header>
      header stuff
      </header>
    );
  }
});



let Layout = React.createClass({
  getDefaultProps() {
    return {test2: '1111'}
  },

  render() {
    return (
      <div id="layout">
        <Header/>
      </div>
    );
  }
});

module.exports = Layout;
