let Layout  = require('components/layout/layout');

let DriversEdit = React.createClass({
  render: () => {
    return (
      <Layout navCurrent='drivers'>
        test
      </Layout>
    )
  }
})
module.exports = DriversEdit;


let Loader = React.createClass({
  getDefaultProps() {
      return {
        classNames: ''
      };
  },

  render: () => {
    return (
      <div className={`loader ${this.props.classNames}`}>...</div>
    )
  }
})
