let Layout = require('components/layout/layout')

let TableActions = React.createClass({
  render() {
    return <span className="actions">
      <i className="fa fa-pencil action"/>
      <i className="fa fa-trash action"/>
    </span>
  }
})

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
        right: <a className="btn success">New Driver</a>
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
              var active = !!_.random(1);
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
      onColumnSorted: (columnKey, order = 'asc') => {}
    };
  },
  render() {
    var columns = this.props.data.columns;

    return (
      <div className={`widget table ${this.props.classNames}`} >
        <div className="header grid">
          <div className="col-1-2 left">{this.props.header.left}</div>
          <div className="col-1-2 right">{this.props.header.right}</div>
        </div>
        <div className="data">
          <div className="data-header">
            {columns.map((column, index) => {
              var column = columns[index];
              return <span className={`column ${column.key}`} key={index} >{column.title}</span>
            })}
          </div>
          <div className="data-items">
            {this.props.data.items.map((item, index) => {
              return (
                <div className={`data-item ${index % 2 == 0? 'even' : 'odd'}`} key={index}>
                  {columns.map((column, index) => {
                    var column = columns[index];
                    return <span className={`column ${column.key}`} key={index}>
                      {(() => {
                        var Component = column.component;
                        if(Component){
                          return <Component item={item}/>
                        }
                        return item[column.key] 
                      })()}
                    </span>
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
});




module.exports = Drivers


