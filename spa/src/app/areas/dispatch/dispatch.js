let Layout = require('components/layout/layout')
let Mapbox = require('components/mapbox/mapbox')

let Dispatch = React.createClass({
  render() {
    return (
      <Layout navCurrent='dispatch'>
        <Mapbox />
      </Layout>
    )
  }
})

module.exports = Dispatch
