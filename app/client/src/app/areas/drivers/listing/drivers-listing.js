let Layout  = require('components/layout/layout');
let Loader  = require('components/loader/loader');
let Table   = require('components/table/table');

let TableActions = React.createClass({
  render() {
    var driver = this.props.item;

    return <span className="actions">
      <a href={`/dashboard/drivers/${driver.id}/edit`}>
        <i className="fa fa-pencil action"/>
      </a>
    </span>
  }
})

let DriversListing = React.createClass({
  getInitialState() {
    return {
      drivers: null
    }
  },

  componentWillMount() {
    axios.get('/api/drivers')
    .then((res) => {
      var drivers = res.data;
      this.setState({'drivers': drivers});
    })
  },

  renderDrivers() {
    if (!this.state.drivers) {
      return <Loader/>
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
        items: _.map(this.state.drivers, driver => {
          return {
            id: driver.id,
            updatedAt: new Date(driver.updatedAt),
            organization: "TODO Chop't",  //organization ID to associate driver
            name: (() => {
                return <a href={`/dashboard/drivers/${driver.id}/edit`}>{`${driver.firstName} ${driver.lastName}`}</a>
              })(),
            phone: driver.phone,
            email: driver.email || '',
            active: (() => {
                var active = driver.onDuty;
                return (
                  <i className={cs({"fa fa-circle": true, active: active, inactive: !active})} />
                )
             })(),
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
      <Layout navCurrent='drivers'>
        <div id="drivers" className="cfww">
          {this.renderDrivers()}
        </div>
      </Layout>
    )
  }
});


module.exports = DriversListing
