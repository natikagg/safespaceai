// LoginPage.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
  return (
    <Authenticator initialState="signIn" signUpAttributes={[
      'name'
    ]}
    socialProviders={['google']}
    >
      {({ signOut, user }) => (
        <div>
          <button onClick={navigate('/app')}>Take me</button>
        </div>
      )}
    </Authenticator>
  );
}

export default Login;