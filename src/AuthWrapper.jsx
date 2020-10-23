import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { withStyles } from "@material-ui/core/styles"
import Backdrop from '@material-ui/core/Backdrop'
import { Auth, API } from "aws-amplify";
import { Typography, CircularProgress } from "@material-ui/core";

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
})

class AuthWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      table: [],
      detailInfo: {},
      loading: false,
      scoring: false,
      scoreError: false,
      error: ""
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.updateDetails = this.updateDetails.bind(this);
    this.updateLoading = this.updateLoading.bind(this);
    this.updateScoring = this.updateScoring.bind(this);
    this.updateScoreError = this.updateScoreError.bind(this);
    this.updateError = this.updateError.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.scoreArticle = this.scoreArticle.bind(this);
    this.getArticleDetails = this.getArticleDetails.bind(this);
    this.apiName = 'DashboardAPI';
    this.path = '/score';
  };

  updateUsername(newUsername) {
    this.setState({ username: newUsername });
  };

  updateTable(newTable) {
    this.setState({ table: newTable });
  };

  updateDetails(newDetails) {
    this.setState({ detailInfo: newDetails });
  };

  updateError(newError) {
    this.setState({ error: newError });
  };

  updateScoreError(newScoreError) {
    this.setState({ scoreError: newScoreError })
  };

  updateLoading(newLoading) {
    this.setState({ loading: newLoading });
  };

  updateScoring(newScoring) {
    this.setState({ scoring: newScoring });
  };

  async signIn(username, password) {
    try {
      this.updateLoading(true);
      await Auth.signIn(username, password);
      // console.log((await Auth.currentSession()).getIdToken().getJwtToken());
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        this.updateUsername(username);
        await Auth.resendSignUp(username);
      } else if (err.code === "NotAuthorizedException") {
        // The error happens when the incorrect password is provided
        this.updateError("Login failed." );
      } else if (err.code === "UserNotFoundException") {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        this.updateError("Login failed.");
      } else {
        this.updateError("An error has occurred.");
        console.error(err);
      }
    }

    this.updateLoading(false);
  };

  async signOut() {
    try {
      this.updateLoading(true);
      await Auth.signOut();
    } catch (err) {
      console.log('error signing out: ', err)
    }
    this.updateLoading(false);
  }

  async getTableData() {
    if (this.props.authState === "signedIn" ){   
      try {
        this.updateLoading(true);

        await API.get(this.apiName, this.path, { queryStringParameters: { action: 'list' } })
          .then(response => {
            this.updateTable(JSON.parse(response['body-json'].body));
          })
          .catch(error => {
            console.log(error);
          })
      } catch (err) {
        console.log(err);
      };

      this.updateLoading(false);
    };
  };

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  async scoreArticle(id) {
    try {
      this.updateScoring(true);

      let isFound = false;

      this.state.table.forEach(item => {
          if (item.id === id) {
              isFound = true;
          }
      });

      if (!isFound && id !== null && id !== '') {
        //if it doesn't show up in the first 100 articles, get it and add to list TODO
        await API.get(this.apiName, this.path, { queryStringParameters: { 'article-id': id } })
          .then(response => {
            // console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      
        await API.get(this.apiName, this.path, { queryStringParameters: { 'article-id': id, 'action': 'missing' }, headers: { 'InvocationType': 'Event' } })
          .then(response => {
            // console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        
        let timeout = 0;
        let returned = false;

        while (timeout < 90) {
          let currentSeconds = new Date().getTime() / 1000
          await this.sleep(10000);

          await API.get(this.apiName, this.path, { queryStringParameters: { 'article-id': id, 'action': 'recheck' } })
          .then(response => {
            if (response['body-json'].statusCode === 202) {
              console.log("Waiting for scoring...");
            } else {
              const newData = JSON.parse(response['body-json'].body);
              var newTable = [{
                author: newData.author,
                id: newData.id,
                prem: newData.prem,
                risk: newData.risk,
                sec: newData.sec,
                title: newData.title
              }].concat(this.state.table)

              this.updateTable(newTable);
              returned = true;
            }            
          })
          .catch(error => {
            console.log(error);
          });

          timeout += new Date().getTime() / 1000 - currentSeconds
        };

        if (!returned) {
          this.updateLoading(false);
          this.updateScoring(false);
          this.updateScoreError(true);
        }
      }
    } catch (err) {
      console.log(err);
    };
      
    this.updateScoring(false);
  };

  async getArticleDetails(id) {
    try {
      this.updateLoading(true);

      await API.get(this.apiName, this.path, { queryStringParameters: { 'article-id': id } })
        .then(response => {
          this.updateDetails(JSON.parse(response['body-json'].body));
        })
        .catch(error => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    };
      
    this.updateLoading(false);
  }

  render() {
    const loading = this.state.loading;
    const scoring = this.state.scoring;
    const erroring = this.state.scoreError;

    let load;

    if (loading) {
      load = <Backdrop className={this.props.classes.backdrop} open={this.state.loading}><CircularProgress color="inherit" /></Backdrop>;
    } else if (scoring) {
      load = <Backdrop className={this.props.classes.backdrop} open={this.state.scoring}><Typography variant="h2">Scoring article, please wait...</Typography><CircularProgress color="inherit" /></Backdrop>;
    } else if (erroring) {
      load = <Backdrop className={this.props.classes.backdrop} open={this.state.scoreError} onClick={() => this.updateScoreError(false)}><Typography variant="h2">Error Scoring Article</Typography></Backdrop>;
    } else {
      load = <div></div>;
    };

    return (
      <div className="flex-1">
        {load}
        <Login
          authState={this.props.authState}
          updateUsername={this.updateUsername}
          updateTable={this.updateTable}
          signIn={this.signIn}
        />
        <Dashboard 
          authState={this.props.authState} 
          signOut={this.signOut}
          getTableData={this.getTableData}
          table={this.state.table}
          scoreArticle={this.scoreArticle}
          detailInfo={this.state.detailInfo}
          getArticleDetails={this.getArticleDetails}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AuthWrapper);