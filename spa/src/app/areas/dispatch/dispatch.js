let Layout = require('components/layout/layout')
let Mapbox = require('components/mapbox/mapbox')
// require('./dispatch.styl')

let Dispatch = React.createClass({
  _onMapCreated(map, L) {
    var drivers = {
      "type": "FeatureCollection",
      "features": [
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Leestown Division", "Address": "2250 Leestown Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.939487, 40.772916 ] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph East", "Address": "150 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [ -73.980434, 40.798757 ] } },
        { "type": "Feature", "properties": { "Name": "Central Baptist Hospital", "Address": "1740 Nicholasville Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.912283, 40.718918 ] } },
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Cooper Dr Division", "Address": "1101 Veterans Dr" }, "geometry": { "type": "Point", "coordinates": [ -73.906483, 40.72972 ] } },
        { "type": "Feature", "properties": { "Name": "Shriners Hospital for Children", "Address": "1900 Richmond Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.972941, 40.722564 ] } },
        { "type": "Feature", "properties": { "Name": "Eastern State Hospital", "Address": "627 W Fourth St" }, "geometry": { "type": "Point", "coordinates": [ -73.998816, 40.760791 ] } },
        { "type": "Feature", "properties": { "Name": "Cardinal Hill Rehabilitation Hospital", "Address": "2050 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.89212, 40.746568 ] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph Hospital", "ADDRESS": "1 St Joseph Dr" }, "geometry": { "type": "Point", "coordinates": [ -73.923636, 40.732475 ] } },
        { "type": "Feature", "properties": { "Name": "UK Medical Center", "Address": "800 Rose St" }, "geometry": { "type": "Point", "coordinates": [ -73.908205, 40.731254 ] }
        }
      ]
    };
      
    var customers = {
      "type": "FeatureCollection",
      "features": [
        { "type": "Feature", "properties": { "Name": "Village Branch", "Address": "2185 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.948369, 40.747876 ] } },
        { "type": "Feature", "properties": { "Name": "Northside Branch", "ADDRESS": "1733 Russell Cave Rd" }, "geometry": { "type": "Point", "coordinates": [ -73.94135, 40.701734 ] } },
        { "type": "Feature", "properties": { "Name": "Central Library", "ADDRESS": "140 E Main St" }, "geometry": { "type": "Point", "coordinates": [ -73.996894, 40.715459 ] } },
        { "type": "Feature", "properties": { "Name": "Beaumont Branch", "Address": "3080 Fieldstone Way" }, "geometry": { "type": "Point", "coordinates": [ -73.957948, 40.712502 ] } },
        { "type": "Feature", "properties": { "Name": "Tates Creek Branch", "Address": "3628 Walden Dr" }, "geometry": { "type": "Point", "coordinates": [ -73.958679, 40.779598 ] } },
        { "type": "Feature", "properties": { "Name": "Eagle Creek Branch", "Address": "101 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [ -73.942219, 40.799437 ] } }
      ]
    };

    // Add marker color, symbol, and size to hospital GeoJSON
    for(var i = 0; i < drivers.features.length; i++) {
      drivers.features[i].properties['marker-color'] = '#DC143C';
      drivers.features[i].properties['marker-symbol'] = 'car';
      drivers.features[i].properties['marker-size'] = 'small';
    };

    // Add marker color, symbol, and size to library GeoJSON
    for (var i = 0; i < customers.features.length; i++) {
      customers.features[i].properties['marker-color'] = '#9c89cc';
      customers.features[i].properties['marker-symbol'] = 'embassy';
      customers.features[i].properties['marker-size'] = 'small';
    };

    map.setView([73.95, -40.7], 12);
    
    var driversLayer = L.mapbox.featureLayer(drivers).addTo(map);

    var customersLayer = L.mapbox.featureLayer(customers).addTo(map);

    // When map loads, zoom to libraryLayer features
    map.fitBounds(customersLayer.getBounds());

    // Bind a popup to each feature in hospitalLayer and libraryLayer
    driversLayer.eachLayer(function (layer) {
      layer.bindPopup('<strong>' + layer.feature.properties.Name + '</strong>', { closeButton: false });
    }).addTo(map);
    customersLayer.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.properties.Name, { closeButton: false });
    }).addTo(map);

    // Open popups on hover
    customersLayer.on('mouseover', function (e) {
      e.layer.openPopup();
    });
    driversLayer.on('mouseover', function (e) {
      e.layer.openPopup();
    });

  },

  getInitialState(){
    return {items: []}
  },

  componentDidMount() {
    setInterval(() => {
      let id = _.uniqueId()
      this.state.items.unshift({id: id, text: "[NEW ORDER] Order #" + id})
      this.state.items = _.take(this.state.items, 15)
      this.forceUpdate();
    }, 1000)
  },

  render() {
    return (
      <Layout navCurrent='dispatch'>
        <div id="dispatch">
          <div id="dispatch-map">
            <Mapbox
              access
              zoomControl={false}
              center={[59.907433, 30.299848]} zoom={17}
              onMapCreated={this._onMapCreated}/>
          </div>
          <div style={{height: 1000}}>
            <React.addons.CssTransitionGroup transitionName="transition" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
              {this.state.items.map((item) => {
                return <div key={item.id}>{item.text}</div>
              })}
            </React.addons.CssTransitionGroup>
          </div>
        </div>
      </Layout>
    )
  }
})

module.exports = Dispatch
