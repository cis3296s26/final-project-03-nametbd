package com.talentstack.api.controller;

import org.springframework.security.core.Authentication;

public final class AuthenticatedUser {

    // Private constructor prevents instantiation since this is a utility class
    private AuthenticatedUser() {
    }

    // Converts the authenticated principal into a Long user ID
    public static Long resolveUserId(Authentication authentication) {
        // If there is no authentication or no principal, return null
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            return null;
        }

        try {
            // Spring Security stores the principal as a string userId in this project
            return Long.parseLong(authentication.getPrincipal().toString());
        } catch (NumberFormatException ignored) {
            // If the principal is not a valid number, treat it as unauthenticated/invalid
            return null;
        }
    }
}