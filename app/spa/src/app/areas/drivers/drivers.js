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

    return (
      this.state.drivers.map(driver => {
        return (
          <p>{JSON.stringify(driver, null, 2)}</p>
        )
      })
    )
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
})

module.exports = Drivers
