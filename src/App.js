import React from 'react';
import './App.css';
import AuthWrapper from './AuthWrapper'
import awsconfig from './aws-exports';
import { Amplify } from 'aws-amplify';
import { Authenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <Authenticator hideDefault={true} amplifyConfig={awsconfig}>
        <AuthWrapper />
      </Authenticator>
    </div>
  );
}

export default App;
