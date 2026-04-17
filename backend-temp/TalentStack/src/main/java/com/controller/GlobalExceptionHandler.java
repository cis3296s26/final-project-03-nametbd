package com.talentstack.api.controller;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

// Applies exception handling globally to all REST controllers
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles @Valid request-body validation failures
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Pull the first field validation error message if available
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + error.getDefaultMessage())
                .orElse("Invalid request");

        // Return HTTP 400 with a JSON error body
        return ResponseEntity.badRequest().body(errorBody(message));
    }

    // Handles validation failures on path variables, request params, etc.
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        // Return a generic HTTP 400 response
        return ResponseEntity.badRequest().body(errorBody("Invalid request"));
    }

    // Handles runtime exceptions thrown by controller/service code
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        // Use the exception message when available
        String message = ex.getMessage() == null ? "Unexpected error" : ex.getMessage();

        // Treat "Invalid credentials" specially as HTTP 401 Unauthorized
        HttpStatus status = "Invalid credentials".equals(message) ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;

        // Return a JSON error with the chosen status
        return ResponseEntity.status(status).body(errorBody(message));
    }

    // Utility method to build a consistent JSON error payload
    private Map<String, String> errorBody(String message) {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("error", message);
        return body;
    }
}