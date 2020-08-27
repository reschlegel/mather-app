const AmplifyConfig = {
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_IRRWRqrOz",
        APP_CLIENT_ID: "17idv4e1g9n6s5sqvrtuupfrs1",
        IDENTITY_POOL_ID: "us-east-1:ff879d9f-9ce1-485d-ae15-a300dc7aadac"
    }    
}

export default {
    Auth: {
        mandatorySignIn: true,
        region: AmplifyConfig.cognito.REGION,
        userPoolId: AmplifyConfig.cognito.USER_POOL_ID,
        identityPoolId: AmplifyConfig.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: AmplifyConfig.cognito.APP_CLIENT_ID
    }
};