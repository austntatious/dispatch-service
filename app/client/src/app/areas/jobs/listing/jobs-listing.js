let Layout  = require('components/layout/layout');
let Loader  = require('components/loader/loader');
let Table   = require('components/table/table');

let TableActions = React.createClass({
  render() {
    var job = this.props.item;

    return <span className="actions">
      <a href={`/dashboard/jobs/${job.id}/edit`}>
        <i className="fa fa-pencil action"/>
      </a>
    </span>
  }
})

let JobsListing = React.createClass({
  getInitialState() {
    return {
      job: null
    }
  },

  componentWillMount() {
    axios.get('/api/jobs')
    .then((res) => {
      var jobs = res.data;
      this.setState({'jobs': jobs});
    })
  },

  renderJobs() {
    if (!this.state.jobs) {
      return <Loader/>
    }

    var tableProps = {
      classNames: '',
      header: {
        left: 'Jobs',
        right: <a id="new-job" className="btn success" href="/dashboard/jobs/create"><i className="fa fa-plus"/>New Job</a>
      },
      data: {
        columns: [
          {
            title: 'Active',
            key: 'active'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Jobs',
            key: 'jobs'
          },
          {
            title: 'Phone',
            key: 'phone'
          },
          {
            title: 'Actions',
            key: 'actions',
            component: TableActions,
            sortingDisabled: true
          }
        ],
        items: _.map(this.state.jobs, job => {
          return {
            id: job.id,
            updatedAt: new Date(job.updatedAt), 
            organization: "TODO Chop't",  //organization ID to associate job
            name: `${job.firstName} ${job.lastName}`,
            phone: job.phone,
            email: job.email || '',
            active: (() => {
              var active = job.onDuty;
              return (
                <i className={cs({"fa fa-circle": true, active: active, inactive: !active})} />
              )
s            })(),
            location: {}, //GeoJson or Long Lat ?
            jobs: _.random(6), //array of job ref IDs
            route: [] // array of pickup and dropoff objects
          }
        })
      }
    };
    return <Table {...tableProps} />
  },

  render() {
    return (
      <Layout navCurrent='jobs'>
        <div id="jobs" className="cfww">
          {this.renderJobs()}
        </div>
      </Layout>
    )
  }
});


module.exports = JobsListing


