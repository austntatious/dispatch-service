let Layout  = require('components/layout/layout');
let Loader  = require('components/loader/loader');

let DriversEdit = React.createClass({
  getDefaultProps() {
  },

  getInitialState() {
    var driverId = this.props.params.driverId || 0;
    return {
      driverId: parseInt(driverId)
    };
  },

  onChange(fieldEvent, changes) {
    var field = fieldEvent.field;
    var fieldType = field.type;

    if (fieldType == 'text') {
      field.values = [changes.target.value];
    }

    this.forceUpdate();
  },

  onSave() {
    var driver = this.state.driver;
    console.log("Saving: ", driver);
    var ajaxInfoMap = {
      create: {
        method: 'post',
        url: '/api/drivers'
      },
      update: {
        method: 'post',
        url: '/api/drivers/' + this.state.driverId
      }
    };
    var ajaxInfo = ajaxInfoMap[this.state.driverId? 'update' : 'create'];
    axios[ajaxInfo.method](ajaxInfo.url, driver)
    .then((res) => {
      console.log(res);

      // Validation. Assume validation failed, if there is a msg
      if (res.data.msg) {
        _.each(res.data.msg, (m) => {
          this.state.fieldsMap[m.param].errors = [m.msg];
        })
        this.forceUpdate();
        return;
      }

      // Everything went okay so far. Redirect to listing page.
      console.log(res.data);
      page('/dashboard/drivers');
    })
  },

  componentWillMount() {
    utils.promise.resolved(this.state.driverId)
    .then((driverId) => {
      // If it's a create driver page
      if (!driverId) {
        this.state.title = "New Driver";
        this.state.action = "Create Driver";

        // Resolve an empty driver object
        return {}
      } else {
        // It's an edit driver page
        this.state.title = "Edit Driver";
        this.state.action = "Save Driver";

        return axios.get('/api/drivers')
          .then((res) => {
            var drivers = res.data;
            return _.find(drivers, (driver) => {
              return driver.id == driverId;
            })
          });
      }
    })
    .then((driver) => {
      var fieldsMap = {
        firstName: {
          name: 'firstName',
          display: 'First Name',
          type: 'text',
          values: [driver.firstName || '']
        },
        lastName: {
          name: 'lastName',
          display: 'Last Name',
          type: 'text',
          values: [driver.lastName || '']
        },
        phone: {
          name: 'phone',
          display: 'Phone',
          type: 'text',
          values: [driver.phone || '']
        },
        email: {
          name: 'email',
          display: 'Email',
          type: 'text',
          values: [driver.email || '']
        }
      }
      this.setState({
        driver: driver,
        fieldsMap: fieldsMap,
        fields: [
          fieldsMap.firstName,
          fieldsMap.lastName,
          fieldsMap.phone,
          fieldsMap.email
        ]
      });
    });
    
  },


  renderForm() {
    var driver = this.state.driver;
    var fields = this.state.fields;
    _.each(fields, (f) => {
      driver[f.name] = f.values[0]
    });

    if(!driver) 
      return <Loader/>

    return (
      <div className="form">
        <div className="fields clearfix">
            {_.map(this.state.fields, (field, index) => {
              var fieldEvent = {
                field: field
              };

              var errorsTransformed = null;
              if (field.errors) {
                errorsTransformed = <div>
                  {_.map(field.errors, (err) => {
                    return <div>{err}</div>
                  })}
                </div>
              }

              return (
                <div className="field grid1" key={index} data-field-type={field.type} data-field-name={field.name}>
                  <MUI.TextField 
                      floatingLabelText={field.display} 
                      value={field.values[0] || ''} 
                      errorText={errorsTransformed}
                      onChange={this.onChange.bind(this, fieldEvent)}/>
                </div>
              )
            })}
        </div>
        <div className="validation-summary">

        </div>
        <div className="actions">
          <MUI.RaisedButton label={this.state.action} secondary={true} onClick={this.onSave} />
        </div>
      </div>
    )
  },

  renderTitle() {
    if(!this.state.driver) return null;

    return (
      <div>
        <i className="fa fa-car" style={{marginRight: 15}}/>
        {this.state.title}
      </div>
    )
  },

  render() {
    return (
      <Layout navCurrent='drivers'>
        <div id="driver-edit" className="cfww">

          <MUI.Card>
            <MUI.CardTitle title={this.renderTitle()} />
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


