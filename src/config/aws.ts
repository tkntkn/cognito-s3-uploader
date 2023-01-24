import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AUTH_REGION,
    userPoolId: import.meta.env.VITE_AUTH_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_AUTH_USER_POOL_WEB_CLIENT_ID,
    cookieStorage: {
      domain: import.meta.env.VITE_AUTH_COOKIE_STORAGE_DOMAIN,
      path: '/',
      expires: 365,
      sameSite: "strict",
      secure: true
    },
    authenticationFlowType: 'USER_SRP_AUTH',
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
  },
  Storage: {
    AWSS3: {
      region: import.meta.env.VITE_S3_REGION,
      bucket: import.meta.env.VITE_S3_BUCKET,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    }
  }
})