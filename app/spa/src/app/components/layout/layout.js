// require('./layout.styl')

/*
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
      },
      {
        name: 'drivers',
        text: 'Drivers',
        url: '/dashboard/drivers',
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
*/

MUI.MoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');

let NavTop = React.createClass({
  getDefaultProps(){
    var links = [
      {
        name: 'dispatch',
        text: 'Dispatch',
        url: '/dashboard/dispatch',
        icon: 'fa fa-rocket'
      },
      // {
      //   name: 'analytics',
      //   text: 'Analytics',
      //   url: '/dashboard/analytics',
      //   icon: 'fa fa-bar-chart'
      // },

      {
        name: 'orders',
        text: 'Orders',
        url: '/dashboard/orders',
        icon: 'fa fa-tags'
      },
      {
        name: 'drivers',
        text: 'Drivers',
        url: '/dashboard/drivers',
        icon: 'fa fa-car'
      }
    ];
    return {links: links}
  },

  render() {
    return (
      <div id="nav-top">
        <div className="cfww grid">
          <div id="nav-top-header" className="col-2-12">Dispatchr</div>
          <div id="nav-top-left" className="col-7-12">
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
          <div id="nav-top-right"className="col-3-12">
            <div className="pull-right" id="nav-top-right-links">
              <div className="nav-top-right-link">
                <MUI.IconMenu
                  iconButtonElement={<MUI.IconButton><MUI.MoreVert/></MUI.IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MUI.MenuItem primaryText="Refresh" />
                  <MUI.MenuItem primaryText="Send feedback" />
                  <MUI.MenuItem primaryText="Settings" />
                  <MUI.MenuItem primaryText="Help" />
                  <MUI.MenuItem primaryText="Sign out" />
                </MUI.IconMenu>
              </div>
            </div>
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
        <NavTop {...this.props}/>
        <div id="content-wrapper">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Layout;
