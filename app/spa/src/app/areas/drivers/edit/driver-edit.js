let Layout  = require('components/layout/layout');
let Loader  = require('components/loader/loader');

let DriversEdit = React.createClass({
  getDefaultProps() {
    return {
          
    };
  },

  getInitialState() {
    return {

    }
  },

  onChange(fieldEvent, changes) {
    var field = fieldEvent.field;
    var fieldType = field.type;

    if (fieldType == 'text') {
      field.values = [changes.target.value];
    }

    this.forceUpdate();
  },

  componentWillMount() {
    var driver = {
      firstName: 'test',
      lastName: 'test2'
    };

    this.setState({
      driver: driver,
      fields: [
        {
          name: 'firstName',
          display: 'First Name',
          type: 'text',
          values: [driver.firstName]
        },
        {
          name: 'lastName',
          display: 'Last Name',
          type: 'text',
          values: [driver.lastName]
        },
        {
          name: 'phone',
          display: 'Phone',
          type: 'text',
          values: [driver.phone]
        },
        {
          name: 'email',
          display: 'Email',
          type: 'text',
          values: [driver.email]
        }
      ]
    })
  },


  renderForm() {
    var driver = this.state.driver;
    if(!driver) 
      return <Loader/>

    return (
      <div className="form">
        <div className="fields clearfix">
            {_.map(this.state.fields, (field, index) => {
              var fieldEvent = {
                field: field
              };

              return (
                <div className="field grid1" key={index} data-field-type={field.type} data-field-name={field.name}>
                  <MUI.TextField 
                      floatingLabelText={field.display} 
                      value={field.values[0] || ''} 
                      onChange={this.onChange.bind(this, fieldEvent)}/>
                </div>
              )
            })}
        </div>
        <div className="actions">
          <MUI.RaisedButton label="Create Driver" secondary={true} onClick={(e) => {
            console.log(e)
          }} />
        </div>
      </div>
    )
  },

  render() {
    return (
      <Layout navCurrent='drivers'>
        <div id="driver-edit" className="cfww">
          <MUI.Card>
            <MUI.CardTitle title={<div><i className="fa fa-car" style={{marginRight: 15}}/>New Driver</div>} />
            <MUI.CardText>
              {this.renderForm()}
            </MUI.CardText>
          </MUI.Card>
        </div>
      </Layout>
    )
  }
})
module.exports = DriversEdit;


