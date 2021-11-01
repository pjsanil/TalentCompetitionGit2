import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import LoggedInBanner from "../../Layout/Banner/LoggedInBanner.jsx";
import { LoggedInNavigation } from "../../Layout/LoggedInNavigation.jsx";
import { JobSummaryCard } from "./JobSummaryCard.jsx";
import { BodyWrapper, loaderData } from "../../Layout/BodyWrapper.jsx";
import { CreateJob } from "../CreateJob/CreateJob.jsx";
import {
  Pagination,
  Icon,
  Dropdown,
  Checkbox,
  Accordion,
  Form,
  Card,
  Button,
} from "semantic-ui-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
//import PaginationJob from "./PaginationJob.jsx";
//import CloseJob from "./CloseJob.jsx";
export default class ManageJob extends React.Component {
  constructor(props) {
    super(props);
    let loader = loaderData;
    loader.allowedUsers.push("Employer");
    loader.allowedUsers.push("Recruiter");
    //console.log(loader)
    this.state = {
      loadJobs: [],
      loaderData: loader,
      currentPage: 1,
      postsPerPage: 5,
      loadJobsPaggination: [],
      sortBy: {
        date: "desc",
      },
      filter: {
        showActive: true,
        showClosed: false,
        showDraft: true,
        showExpired: true,
        showUnexpired: true,
      },
      totalPages: 1,
      activeIndex: "",
      editJob: false,
      currentId: "",
      closeJob: false,
    };
    this.loadData = this.loadData.bind(this);
    this.init = this.init.bind(this);
    this.loadNewData = this.loadNewData.bind(this);
    //your functions go here
    this.toggleEditJob = this.toggleEditJob.bind(this);
    //this.toggleCloseJob = this.toggleCloseJob.bind(this);
    this.paginate = this.paginate.bind(this);
  }
  init() {
    let loaderData = TalentUtil.deepCopy(this.state.loaderData);
    loaderData.isLoading = false;
    this.setState({ loaderData }); //comment this
    //set loaderData.isLoading to false after getting data
    this.loadData(() => this.setState({ loaderData }));
  }
  componentDidMount() {
    this.init();
  }
  loadData(callback, activepage) {
    var cookies = Cookies.get("talentAuthToken");
    if (Number.isInteger(callback)) {
      var page = callback - 1;
    } else {
      var page = activepage != undefined ? currentpage : this.state.currentPage;
    }
    $.ajax({
      //url:"https://talentservicetalent.azurewebsites.net//listing/listing/getSortedEmployerJobs" +
      url:
        "http://localhost:51689/listing/listing/getSortedEmployerJobs" +
        "?activePage=" +
        page +
        "&sortbyDate=" +
        this.state.sortBy.date +
        "&showActive=" +
        this.state.filter.showActive +
        "&showClosed=" +
        this.state.filter.showClosed +
        "&showDraft=" +
        this.state.filter.showDraft +
        "&showExpired=" +
        this.state.filter.showExpired +
        "&showUnexpired=" +
        this.state.filter.showUnexpired,
      headers: {
        Authorization: "Bearer " + cookies,
        "Content-Type": "application/json",
      },
      type: "GET",
      dataType: "json",
      success: function(res) {
        this.setState({
          loadJobs: res.myJobs,
          loader: false,
        });
        const indexOfLastPage =
          this.state.currentPage * this.state.postsPerPage;
        const indexOfFirstPost = indexOfLastPage - this.state.postsPerPage;
        this.setState({
          loadJobsPaggination: this.state.loadJobs.slice(
            indexOfFirstPost,
            indexOfLastPage
          ),
        });
      }.bind(this),
      error: function(res) {
        console.log(res.status);
      },
    });
  }
  paginate(number) {
    this.setState({
      currentPage: number,
    });
    this.loadData(number);
  }
  loadNewData(data) {
    var loader = this.state.loaderData;
    loader.isLoading = true;
    data[loaderData] = loader;
    this.setState(data, () => {
      this.loadData(() => {
        loader.isLoading = false;
        this.setState({
          loadData: loader,
        });
      });
    });
  }
  toggleEditJob(e, data, id) {
    e.preventDefault();
    this.setState({
      editJob: data,
    });
    if (id != null) {
      this.setState({
        currentId: id,
      });
    }
    this.props.history.push("/EditJob/" + id);
  }
  //   toggleCloseJob(data, id) {
  //     this.setState({
  //       closeJob: data,
  //     });
  //     if (id != null) {
  //       this.setState({
  //         currentId: id,
  //       });
  //     }
  //   }
  render() {
      console.log("the value is ", this.state.loadJobs.length)
    return (
      <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
        <section className="page-body">
          <div>
            <div className="ui container">
              <h1>List Of Jobs</h1>
              <div>
                <span>
                  <Icon name="filter" />
                  Filter:{" "}
                </span>
                <Dropdown text="Choose filter" className="bold">
                  <Dropdown.Menu></Dropdown.Menu>
                </Dropdown>
                <span>
                  {" "}
                  <Icon name="calendar alternate" />
                  Sort by date:{" "}
                </span>
                <Dropdown text="Newest first" className="bold">
                  <Dropdown.Menu></Dropdown.Menu>
                </Dropdown>
              </div>
              <br />
              {(() => {
                if (this.state.loadJobs.length > 0) {
                  return (
                    <div>
                      <Card.Group
                        itemsPerRow={2}
                        stackable={true}
                        doubling={true}
                      >
                        {this.state.loadJobsPaggination.map((job) => (
                          <JobSummaryCard
                            job={job}
                            key={job.id}
                            // toggleCloseJob={this.toggleCloseJob}
                            toggleEditJob={this.toggleEditJob}
                          />
                        ))}
                      </Card.Group>
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <h3>No jobs found</h3>
                    </div>
                  );
                }
              })()}
              <br />
              <br />
              {/* <PaginationJob
                postsPerPage={this.state.postsPerPage}
                totalPosts={this.state.loadJobs.length}
                paginate={this.paginate}
              /> */}
              {/* <CloseJob
                //id={this.state.currentId}
                // toggleCloseJob={this.toggleCloseJob}
                // init={this.init}
              /> */}
              <br />
              <br />
              <br />
            </div>
          </div>
        </section>
        <br />
      </BodyWrapper>
    );
  }
}





