import React from 'react';
import './css/Dashboard.scss';
import ProjectList from './components/ProjectList';
import EditProjectDialog from './components/EditProjectDialog';
import Utils from './classes/Utils';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import $ from 'jquery';
import { _ } from './classes/gettext';

class Dashboard extends React.Component {
  constructor(){
    super();
    
    this.handleAddProject = this.handleAddProject.bind(this);
    this.addNewProject = this.addNewProject.bind(this);
  }

  handleAddProject(){
    this.projectDialog.show();
  }

  addNewProject(project){
    if (!project.name) return (new $.Deferred()).reject(_("Name field is required"));

    return $.ajax({
          url: `/api/projects/`,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            name: project.name,
            description: project.descr,
            tags: project.tags
          })
      }).done(() => {
        this.projectList.refresh();
      });
    }
    
  render() {
    const projectList = ({ location, history }) => {
      let q = Utils.queryParams(location);
      if (q.page === undefined) q.page = 1;
      else q.page = parseInt(q.page);

      return <ProjectList
                source={`/api/projects/${Utils.toSearchQuery(q)}`}
                ref={(domNode) => { this.projectList = domNode; }} 
                currentPage={q.page}
                currentSearch={q.search}
                history={history}
                />;
    };


    return (
      <Router basename="/dashboard">
        <div>
          <div 
          // Ensight Edit
            style={{display:"flex", flexDirection:"row",borderRadius:"0px 0px 10px 10px",padding:"2rem 2.5rem", color:"white",backgroundImage:`url("/static/app/img/WelcomeBanner.png")`, width:"100%", justifyContent:"space-between", alignItems:"center"}} 
            className="text-right add-button">
            <div style={{textAlign:"start",paddingLeft:"1rem"}}>
              <h2 style={{fontWeight:"900"}}>Hello Pilot !</h2>
              <p>Where Are We Flying Today?</p>
            </div>
            <div className=''>
              <button style={{width:"fit", color:"white", backgroundColor:"rgba(255, 255, 255, 0.1)"}} type="button" 
                      className="btn btn-sm"
                      onClick={this.handleAddProject}>
                <i className="glyphicon glyphicon-plus" style={{paddingRight:"1rem"}}></i>
                {_("Add Project")}
              </button>
            </div>
          </div>

          <EditProjectDialog 
            saveAction={this.addNewProject}
            ref={(domNode) => { this.projectDialog = domNode; }}
            />
          <Route path="/" component={projectList} />
        </div>
      </Router>
    );
  }
}

$(function(){
    $("[data-dashboard]").each(function(){
        window.ReactDOM.render(<Dashboard/>, $(this).get(0));
    });


    // Warn users if there's any sort of work in progress before
    // they press the back button on the browser
    // Yes it's a hack. No we're not going to track state in React just
    // for this.
    window.onbeforeunload = function() {
        let found = false; 
        $(".progress-bar:visible").each(function(){ 
            try{
                let value = parseFloat($(this).text());
                if (!isNaN(value) && value > 0 && value < 100) found = true;
            }catch(e){
                // Do nothing
            }
        });
        return found ? _("Your changes will be lost. Are you sure you want to leave?") : undefined; 
    };
});

export default Dashboard;
