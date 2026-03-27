package com.talentstack.api.controller;

/**
 * SpaForwardController forwards known non-API routes to index.html.
 *
 * This allows the client-side single-page application router to handle deep links while
 * avoiding direct server-side view resolution for frontend paths.
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping({
            "/",
            "/login",
            "/signup",
            "/dashboard",
            "/plan",
            "/analytics",
            "/form-review",
            "/settings",
            "/profile"
    })
    public String forwardIndex() {
        return "forward:/index.html";
    }
}