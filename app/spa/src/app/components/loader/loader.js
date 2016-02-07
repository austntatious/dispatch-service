let Loader = React.createClass({
  getDefaultProps() {
      return {
        classNames: ''
      };
  },

  render() {
    return (
      <div className={`loader ${this.props.classNames}`}>...</div>
    )
  }
})

module.exports = Loader;
