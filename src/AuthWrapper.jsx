import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";

class AuthWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
    this.updateUsername = this.updateUsername.bind(this);
  }

  updateUsername(newUsername) {
    this.setState({ username: newUsername });
  }

  render() {
    return (
      <div className="flex-1">
          <Login
            authState={this.props.authState}
            updateUsername={this.updateUsername}
            onStateChange={this.props.onStateChange}
          />
        <Dashboard authState={this.props.authState} onStateChange={this.props.onStateChange} />
      </div>
    );
  }
}

export default AuthWrapper;