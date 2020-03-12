import React from "react";
import { Route, Redirect } from "react-router-dom";

// This function extracts the end of the URL for routing
function querystring(name, url = window.location.href) {
    name = name.replace(/[[]]/g, "\\$&");
    
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);
    
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
    /*
    Create a redirect url by adding redirect into the path
    if the user is not authenticated
    */
    const redirect = querystring("redirect");
    return (
      <Route
        {...rest}
        render={props =>
          !appProps.isAuthenticated
            ? <C {...props} {...appProps} />
            : <Redirect
                to={redirect === "" || redirect === null ? "/" : redirect}
              />}
      />
    );
  }