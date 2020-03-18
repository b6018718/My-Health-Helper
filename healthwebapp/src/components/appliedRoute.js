import React from "react";
import { Route } from "react-router-dom";

/*This route allows unathenticated users access,
so should be used for the login and registration pages */

export default function AppliedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route {...rest} render={props => <C {...props} {...appProps} />} />
  );
}