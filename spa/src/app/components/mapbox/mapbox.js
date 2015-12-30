//https://github.com/iamale/MapboxMap
// require('./mapbox.styl')

var MapboxMap = React.createClass({
  
  componentDidMount: function(argument) {
    var props = this.props;

    var mapId = props.mapId || props.src || "mapbox.streets";

    var options = {};
    var ownProps = ['mapId', 'onMapCreated'];
    for (var k in props) {
      if (props.hasOwnProperty(k) && ownProps.indexOf(k) === -1) {
        options[k] = props[k];
      }
    }
    
    L.mapbox.accessToken = 'pk.eyJ1IjoiYXVzdG50YXRpb3VzIiwiYSI6ImNpaWY2NnYwbzAxbXR0eWtya3VmaXQxbTcifQ._bNp2h1g2hK_7XQakbhxjQ';
    var map = L.mapbox.map(this.refs.map, mapId, options);

    if (this.props.onMapCreated) {
      this.props.onMapCreated(map, L);
    }
  },

  render: function() {
    var mapStyle = {
      width: '100%',
      height: '100%'
    };

    return (
      <div style={mapStyle} ref="map"></div>
    );
  }
});

module.exports = MapboxMap;
