package com.talentstack.api.controller;

/**
 * SpaForwardController forwards known non-API routes to index.html.
 *
 * This allows the client-side single-page application router to handle deep links while
 * avoiding direct server-side view resolution for frontend paths.
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// Standard MVC controller because this returns a forwarded view path, not JSON
@Controller
public class SpaForwardController {

    // Maps known frontend routes so refreshing those URLs still loads index.html
    @RequestMapping({
            "/",           // homepage
            "/login",      // login page route
            "/signup",     // signup page route
            "/dashboard",  // dashboard route
            "/plan",       // plan route
            "/analytics",  // analytics route
            "/form-review",// form review route
            "/settings",   // settings route
            "/profile"     // profile route
    })
    public String forwardIndex() {
        // Forwards request to the SPA entry point
        return "forward:/index.html";
    }
}