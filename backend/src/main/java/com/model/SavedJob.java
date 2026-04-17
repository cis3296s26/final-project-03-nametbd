package com.talentstack.api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "saved_jobs",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_saved_jobs_user_external", columnNames = {"user_id", "external_job_id"})
        }
)
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saved_job_id")
    private Long savedJobId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "external_job_id", length = 120)
    private String externalJobId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "company", length = 255)
    private String company;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "redirect_url", length = 1024)
    private String redirectUrl;

    @Column(name = "source", nullable = false, length = 32)
    private String source;

    @Column(name = "application_status", nullable = false, length = 32)
    private String applicationStatus;

    @Column(name = "saved_at", nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    void onCreate() {
        if (savedAt == null) {
            savedAt = LocalDateTime.now();
        }
    }

    public Long getSavedJobId() {
        return savedJobId;
    }

    public User getUser() {
        return user;
    }

    public String getExternalJobId() {
        return externalJobId;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public String getSource() {
        return source;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setExternalJobId(String externalJobId) {
        this.externalJobId = externalJobId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }
}