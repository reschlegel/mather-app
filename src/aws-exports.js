import { Auth } from "aws-amplify";

const AmplifyConfig = {
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_VNN49UqUz",
        APP_CLIENT_ID: "7lncvd200pan6geidqe9vauek9",
        IDENTITY_POOL_ID: "us-east-1:5f6b8726-2d70-41eb-ba6f-b71d36bccb2a"
    }    
}

export default {
    Auth: {
        mandatorySignIn: true,
        region: AmplifyConfig.cognito.REGION,
        userPoolId: AmplifyConfig.cognito.USER_POOL_ID,
        identityPoolId: AmplifyConfig.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: AmplifyConfig.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "DashboardAPI",
                endpoint: "https://fkmqixk070.execute-api.us-east-1.amazonaws.com/v1",
                custom_header: async () => {
                    return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
                }
            }
        ]
    }
};