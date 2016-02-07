let Layout  = require('components/layout/layout');
let Table   = require('components/table/table');

let TableActions = React.createClass({
  render() {
    return <span className="actions">
      <i className="fa fa-pencil action"/>
      <i className="fa fa-trash action"/>
    </span>
  }
})

let DriversListing = React.createClass({
  initialState() {
    return {
      drivers: null
    }
  },

  componentWillMount() {
    var drivers = [];
    _.times(10, function() {
      drivers.push({
        
      })
    })
    this.setState({'drivers': drivers});
  },

  renderDrivers() {
    if (!this.state.drivers) {
      return <div>loading...</div>
    }

    var tableProps = {
      classNames: '',
      header: {
        left: 'Drivers',
        right: <a id="new-driver" className="btn success" href="/dashboard/drivers/create"><i className="fa fa-plus"/>New Driver</a>
      },
      data: {
        columns: [
          {
            title: 'Active',
            key: 'active'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Orders',
            key: 'orders'
          },
          {
            title: 'Phone',
            key: 'phone'
          },
          {
            title: 'Actions',
            key: 'actions',
            component: TableActions,
            sortingDisabled: true
          }
        ],
        items: _.map(_.range(0,10), id => {
          return {
            id: id,
            updatedAt: new Date(), 
            organization: "Chop't",  //organization ID to associate driver
            name: "woosh",
            phone: `${_.random(0, 999)}-${_.random(0, 999)}-${_.random(0, 9999)}`,
            email: "woosh",
            active: (() => {
              var active = id < 6;
              return (
                <i className={cs({"fa fa-circle": true, active: active, inactive: !active})} />
              )
s            })(),
            location: {}, //GeoJson or Long Lat ?
            orders: _.random(6), //array of job ref IDs
            route: [] // array of pickup and dropoff objects
          }
        })
      }
    };
    return <Table {...tableProps} />
  },

  render() {
    return (
      <Layout navCurrent='orders'>
        <div id="orders" className="cfww">
          {this.renderDrivers()}
        </div>
      </Layout>
    )
  }
});


module.exports = DriversListing


