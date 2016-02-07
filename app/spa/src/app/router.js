var sitemap = window.sitemap = [
  {
    routes: ['/dispatch'],
    handler: require('areas/dispatch/dispatch')
  },

  {
    routes: ['/orders'],
    handler: require('areas/orders/listing/orders-listing')
  },
  {
    routes: ['/orders/create', 'orders/:orderId/edit'],
    handler: require('areas/orders/edit/order-edit')
  },

  {
    routes: ['/drivers'],
    handler: require('areas/drivers/listing/drivers-listing')
  },
  {
    routes: ['/drivers/create', '/drivers/:driverId/edit'],
    handler: require('areas/drivers/edit/driver-edit')
  }
];

var Router = React.createClass({
  getInitialState() {
    return {
      component: <div/>
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
            var qsParsed = {}
            _.each(ctx.querystring.split('&'), (frag) => {
              var split = frag.split('=');
              qsParsed[split[0]] = split[1];
            });

            console.log("Setting handler", area.handler.displayName)
            var Component = area.handler;

            self.setState({
              component:  <Component params={ctx.params} qs={ctx.querystring} qsParsed={qsParsed} context={ctx} next={next}/> 
            });
          }
            
        })
      })
    });
    page.start();
  },

  render() {
    let Component = this.state.component;
    return Component;
  }
})

module.exports = Router;
