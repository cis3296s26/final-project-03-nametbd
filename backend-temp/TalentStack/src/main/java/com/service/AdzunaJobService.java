package com.talentstack.api.service;

import com.talentstack.api.dto.JobListingResponse;
import com.talentstack.api.dto.JobPreferencesRequest;
import com.talentstack.api.dto.JobSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AdzunaJobService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${adzuna.base-url:https://api.adzuna.com/v1/api/jobs}")
    private String adzunaBaseUrl;

    @Value("${adzuna.country:us}")
    private String adzunaCountry;

    @Value("${adzuna.app-id:}")
    private String adzunaAppId;

    @Value("${adzuna.app-key:}")
    private String adzunaAppKey;

    public JobSearchResponse searchJobs(JobPreferencesRequest preferences, Integer page, Integer pageSize) {
        if (adzunaAppId == null || adzunaAppId.isBlank() || adzunaAppKey == null || adzunaAppKey.isBlank()) {
            throw new RuntimeException("Adzuna credentials are not configured");
        }

        int requestedPage = page == null ? 1 : Math.max(page, 1);
        int requestedPageSize = pageSize == null ? 20 : Math.min(Math.max(pageSize, 1), 50);

        String url = UriComponentsBuilder
                .fromHttpUrl(adzunaBaseUrl + "/" + adzunaCountry + "/search/" + requestedPage)
                .queryParams(buildQueryParams(preferences, requestedPageSize))
                .build(true)
                .toUriString();

        Map body;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            body = response.getBody();
        } catch (RestClientException ex) {
            throw new RuntimeException("Unable to fetch jobs from Adzuna right now");
        }
        if (body == null) {
            return new JobSearchResponse(0, List.of());
        }

        int count = ((Number) body.getOrDefault("count", 0)).intValue();
        List<Map<String, Object>> results = (List<Map<String, Object>>) body.getOrDefault("results", List.of());
        List<JobListingResponse> jobs = new ArrayList<>();

        for (Map<String, Object> item : results) {
            Map<String, Object> company = safeMap(item.get("company"));
            Map<String, Object> location = safeMap(item.get("location"));

            jobs.add(new JobListingResponse(
                    toStringOrNull(item.get("id")),
                    toStringOrNull(item.get("title")),
                    toStringOrNull(company.get("display_name")),
                    toStringOrNull(location.get("display_name")),
                    toStringOrNull(item.get("description")),
                    toStringOrNull(item.get("redirect_url")),
                    intOrNull(item.get("salary_min")),
                    intOrNull(item.get("salary_max")),
                    toStringOrNull(item.get("contract_type")),
                    toStringOrNull(item.get("created"))
            ));
        }

        return new JobSearchResponse(count, jobs);
    }

    private MultiValueMap<String, String> buildQueryParams(JobPreferencesRequest preferences, int pageSize) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("app_id", adzunaAppId);
        params.add("app_key", adzunaAppKey);
        params.add("results_per_page", String.valueOf(pageSize));
        if (preferences != null) {
            if (preferences.keyWords() != null && !preferences.keyWords().isBlank()) {
                params.add("what", preferences.keyWords());
            }
            if (preferences.location() != null && !preferences.location().isBlank()) {
                params.add("where", preferences.location());
            }
            if (preferences.distance() != null) {
                params.add("distance", String.valueOf(preferences.distance()));
            }
            if (preferences.salaryMin() != null) {
                params.add("salary_min", String.valueOf(preferences.salaryMin()));
            }
            if (preferences.salaryMax() != null) {
                params.add("salary_max", String.valueOf(preferences.salaryMax()));
            }
            if (preferences.contractType() != null && !preferences.contractType().isBlank()) {
                params.add("contract_type", preferences.contractType());
            }
            if (preferences.maxDaysOld() != null) {
                params.add("max_days_old", String.valueOf(preferences.maxDaysOld()));
            }
        }
        return params;
    }

    private static Map<String, Object> safeMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return Map.of();
    }

    private static String toStringOrNull(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private static Integer intOrNull(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number n) {
            return n.intValue();
        }
        return null;
    }
}