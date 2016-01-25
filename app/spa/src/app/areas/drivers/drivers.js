let Layout = require('components/layout/layout')

let Drivers = React.createClass({
  initialState() {
    return {
      drivers: null
    }
  },

  componentWillMount() {
    var drivers = [];
    _.times(10, function() {
      drivers.push({
        updatedAt: new Date(), 
        organization: "Chop't",  //organization ID to associate driver
        name: "woosh",
        phone: _.random(0, 9999999999),
        email: "woosh",
        active: _.random(1),
        location: {}, //GeoJson or Long Lat ?
        currentJobs: [], //array of job ref IDs
        route: [], // array of pickup and dropoff objects
                      // e.g. [{type: pickup, jobid: refId }, {pickup: }, {dropoff: }]
                      // allow driver to mark task as delayed

      })
    })
    this.setState({'drivers': drivers});
  },

  renderDrivers() {
    if (!this.state.drivers) {
      return <div>loading...</div>
    }

    return <Table items={this.state.drivers} />
  },

  render() {
    return (
      <Layout navCurrent='drivers'>
        <div id="drivers" className="cfww">
          {this.renderDrivers()}
        </div>
      </Layout>
    )
  }
});

let Table = React.createClass({
  getDefaultProps() {
    return {
      classNames: '',
      header: '',
      items: [] 
    };
  },

  render() {
    return (
      <div className={`table ${this.props.classNames}`} >
        <div className="table-header">{this.props.header}</div>
        <div className="table-content">
          {this.props.items.map(item => {
            return <div className="table-row">
              {JSON.stringify(item, null, 2)}
            </div>
          })}
        </div>
      </div>
    )
  }
});






module.exports = Drivers


