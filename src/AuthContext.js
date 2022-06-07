import React from 'react';

const AuthContext = React.createContext({});

export function withAuthContext(Component) {
  return function contextedComponent(props) {
    return (
      <AuthContext.Consumer>
        {({ auth, setAuth }) => <Component {...props} auth={auth} setAuth={setAuth} />}
      </AuthContext.Consumer>
    );
  };
}

export default AuthContext;
