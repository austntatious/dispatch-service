var Links = React.createClass({
  render() {
    return (
      <div>
        <a href="/">go to home</a><br/><br/>
        <a href="/dispatch">go to dispatch</a><br/><br/>
        <a href="/analytics">go to analytics</a><br/><br/>
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
    handler: noop
    // redirect: '/dispatch'
  },
  {
    routes: ['/dispatch'],
    handler: require('areas/dispatch/dispatch')
  },
  {
    routes: ['/analytics'],
    handler: analytics
  }
];

var Router = React.createClass({
  getInitialState() {
    return {
      component: noop
    }
  },

  componentDidMount() {
    let self = this;
    _.each(sitemap, (area) => {
      _.each(area.routes, (route) => {
        page(route, (ctx, next) => {

          if(area.redirect) {
            console.log("redirecting to ", area.redirect)
            setTimeout( () => {
              page(area.redirect);
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
