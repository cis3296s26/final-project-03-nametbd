package com.talentstack.api.dto;

/**
 * MeResponse is returned by the authenticated /api/me endpoint.
 *
 * It provides the signed-in user's identity and display name data derived from account
 * and profile tables.
 */

public record MeResponse(
        Long userId,
        String email,
        String firstName,
        String lastName
) {}
