let Layout = require('components/layout/layout')

let TableActions = React.createClass({
  render() {
    return <span>some action</span>
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
        title: 'Drivers',
        rightSide: null
      },
      data: {
        columns: [
          {
            title: 'Active',
            key: 'active',
            width: '100px'
          },
          {
            title: 'Name',
            key: 'name',
            width: '100px'
          },
          {
            title: 'Orders',
            key: 'orders',
            width: '100px'
          },
          {
            title: 'Phone',
            key: 'phone',
            width: '100px'
          },
          {
            title: 'Actions',
            width: '100px',
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
            phone: _.random(0, 9999999999),
            email: "woosh",
            active: (!!_.random(1)).toString(),
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
        <div className="header">{this.props.header.title}</div>
        <div className="data">
          <div className="data-header">
            {columns.map((column, index) => {
              var column = columns[index];
              return <span className={`column`} key={index} style={{width: column.width || 'initial'}}>{column.title}</span>
            })}
          </div>
          <div className="data-items">
            {this.props.data.items.map((item, index) => {
              return (
                <div className={`data-item ${index % 2 == 0? 'even' : 'odd'}`} key={index}>
                  {columns.map((column, index) => {
                    var column = columns[index];
                    return <span className={`column`} key={index} style={{width: column.width || 'initial'}}>
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


