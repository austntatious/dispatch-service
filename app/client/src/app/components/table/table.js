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

module.exports = Table;
