
require("./../../../public/css/spa/app.css");

class App extends React.Component {
  render() {
    return (
      <div id='app'>
        <Nav/>
        <Content/>
      </div>
    )
  }
}

class Nav extends React.Component {
  render() {
    return <h1 className='nav'>Test 1</h1>
  }
}

class Content extends React.Component {
  constructor() {
    super()
    this.state = {a: 2}

    setInterval( ()=>{
      this.setState({a: this.state.a + 1})
    }, 1000)
  }
  render() {
    return (
      <h1>counter: {this.state.a}</h1>
    );
  }
}

var Router = require('./router.js')

ReactDOM.render(<Router/>, document.getElementById('app-container'));

