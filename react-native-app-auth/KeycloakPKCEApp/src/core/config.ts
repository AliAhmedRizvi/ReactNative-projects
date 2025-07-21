export const authConfig = {

    issuer: 'http://localhost:9192/realms/PKCE-RN',
    clientId: 'app-auth',
    redirectUrl: 'myapp://callback',
    scopes: ['openid', 'profile', 'email'],
    serviceConfiguration: {
        authorizationEndpoint: 'http://localhost:9192/realms/PKCE-RN/protocol/openid-connect/auth',
        tokenEndpoint: 'http://localhost:9192/realms/PKCE-RN/protocol/openid-connect/token',
        revocationEndpoint: 'http://localhost:9192/realms/PKCE-RN/protocol/openid-connect/revoke',
    },
    


}