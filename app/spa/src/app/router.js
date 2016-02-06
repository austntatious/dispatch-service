var Links = React.createClass({
  render() {
    return (
      <div>
        <a href="/">go to home</a><br/><br/>
        <a href="/dashboard/dispatch">go to dispatch</a><br/><br/>
        <a href="/dashboard/analytics">go to analytics</a><br/><br/>
      </div>
    )
  }
})


var noop = React.createClass({
  componentDidMount() {
  },
  componentWillMount() {
  },
  render() {
    console.log('index')
    return (
      <div>
        <Links/>
      </div>
    )
  }
});



var analytics = React.createClass({
  render() {
    return (
      <div>analytics 
        <Links/>
      </div>
    )
  }
});

var sitemap = window.sitemap = [
  {
    routes: ['/'],
    handler: noop,
    redirect: '/dispatch'
  },
  {
    routes: ['/dispatch'],
    handler: require('areas/dispatch/dispatch')
  },
  {
    routes: ['/analytics'],
    handler: require('areas/analytics/analytics')
  },
  {
    routes: ['/drivers'],
    handler: require('areas/drivers/listing/drivers-listing')
  },
  {
    routes: ['/drivers/create', 'drivers/:driverId/edit'],
    handler: require('areas/drivers/edit/driver-edit')
  }
];

var Router = React.createClass({
  getInitialState() {
    return {
      component: noop
    }
  },

  componentDidMount() {
    let self = this,
      pathRoot = "/dashboard";
    _.each(sitemap, (area) => {
      _.each(area.routes, (route) => {
        let routeNormalized = pathRoot + route;
        console.log(routeNormalized);
        
        page(routeNormalized, (ctx, next) => {

          if(area.redirect) {
            console.log("redirecting to ", area.redirect)
            setTimeout( () => {
              page(pathRoot + area.redirect);
            }, 10)
            
          } else {
            console.log("Setting handler", area.handler.displayName)
            self.setState({
              component: area.handler
            });
          }
            
        })
      })
    });
    page.start();
  },

  render() {
    let Component = this.state.component;
    return <Component/>
  }
})

module.exports = Router;
