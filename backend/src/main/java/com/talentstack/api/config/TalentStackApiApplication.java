package com.talentstack.api;

/**
 * TalentStackApiApplication is the Spring Boot entry point for the API service.
 *
 * The main method boots the application context and starts embedded server components.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TalentStackApiApplication {
    public static void main(String[] args){SpringApplication.run(TalentStackApiApplication.class, args);}
}
