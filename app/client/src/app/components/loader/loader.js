let Loader = React.createClass({
  getDefaultProps() {
      return {
        classNames: ''
      };
  },

  render() {
    return (
      <div className={`loader ${this.props.classNames}`}><i className="fa fa-spinner"/></div>
    )
  }
})

module.exports = Loader;
