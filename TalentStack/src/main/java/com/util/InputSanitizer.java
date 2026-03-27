package com.talentstack.api.util;

/**
 * InputSanitizer centralizes normalization and cleanup for user-supplied strings.
 *
 * The utility performs Unicode normalization, control-character stripping, whitespace
 * collapsing, and field-specific cleanup (email/name) so services persist
 * consistent and safer values.
 */

import java.text.Normalizer;
import java.util.Locale;

public final class InputSanitizer {

    private InputSanitizer() {
    }

    public static String sanitizeEmail(String value) {
        String normalized = sanitizeBasic(value);
        return normalized.toLowerCase(Locale.ROOT).replace(" ", "");
    }

    public static String sanitizeName(String value) {
        String normalized = sanitizeBasic(value);
        String cleaned = normalized.replaceAll("[^\\p{L} .'-]", "");
        return cleaned.replaceAll("\\s+", " ").trim();
    }

    private static String sanitizeBasic(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Input is required");
        }

        String normalized = Normalizer.normalize(value, Normalizer.Form.NFKC)
                .replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]", "")
                .trim();

        String collapsedWhitespace = normalized.replaceAll("\\s+", " ");
        if (collapsedWhitespace.isEmpty()) {
            throw new IllegalArgumentException("Input is required");
        }

        return collapsedWhitespace;
    }
}