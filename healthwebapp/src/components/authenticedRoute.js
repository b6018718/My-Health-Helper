import React from "react";
import { Route, Redirect } from "react-router-dom";

// This route redirects any unauthenticated users back to the log in screen

export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.appProps.isAuthenticated
          ? <C {...props} {...appProps} />
          : <Redirect
            to={`/?redirect=${props.location.pathname}${props.location
              .search}`}
          />}
    />
  );
}