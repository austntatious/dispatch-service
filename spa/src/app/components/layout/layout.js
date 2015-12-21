require('./layout.styl')

let NavLeft = React.createClass({
  getDefaultProps(){
    var links = [
      {
        name: 'dispatch',
        text: 'Dispatch',
        url: '/dashboard/dispatch',
        icon: 'fa fa-rocket'
      },
      {
        name: 'analytics',
        text: 'Analytics',
        url: '/dashboard/analytics',
        icon: 'fa fa-bar-chart'
      }
    ];
    return {links: links}
  },


  render() {
    return (
      <div id="nav-left">
        <div className="nav-header">Dispatchr</div>
        <div className="nav-links">
          {_.map(this.props.links, (link, i) => {
            return (
              <a className={cs({"nav-link-container": true, active: link.name == this.props.navCurrent})} href={link.url} key={i}>
                <span className="nav-link"><i className={link.icon}/>{link.text}</span> 
              </a>
            )
          })}
        </div>
      </div>
    );
  }
});

let NavTop = React.createClass({
  render() {
    return (
      <div id="nav-top" className="clearfix">
        <div className="pull-right" id="nav-top-right-links">
          <div className="nav-top-right-link">
            <i className="fa fa-bolt " />
          </div>
          <div className="nav-top-right-link">
            <i className="fa fa-cog" />
          </div>
        </div>
      </div>
    );
  }
});

let Layout = React.createClass({
  render() {
    return (
      <div id="layout">
        <NavLeft {...this.props}/>
        <div id="content-prewrapper">
          <NavTop {...this.props}/>
          <div id="content-wrapper">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Layout;
