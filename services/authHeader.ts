import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

export default async function authHeader () {
    try {
        const userAttributes = await fetchUserAttributes();
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        console.log("idtoken" + idToken);
        const headers = {
            Authorization: `Bearer ${idToken?.toString()}`
        };
        return headers;
    } catch (error : any) {
        if (((error.message.includes('User needs to be authenticated')) || (error.name === 'UserUnAuthenticatedException') ||
        (error.message.includes('Access Token has been revoked')) || (error.name === 'NotAuthorizedException'))) {
            console.log(error);
            window.location.reload();
        }
    }
};
