package com.talentstack.api.model;

/**
 * SiteConnections represents a user-owned external site credential connection.
 *
 * The row is keyed by a composite identifier and stores source/user credential fields
 * that can be used to connect to external providers.
 */

import jakarta.persistence.*;

@Entity
@Table(name = "site_connections")
public class SiteConnections{
    @EmbeddedId
    private UserSiteId id;

    @Column(name = "source_num", insertable = false, updatable = false, nullable = false)
    private Integer sourceNum;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    public Integer getSourceNum(){return sourceNum;}
    public String getUsername(){return username;}
    public String getPassword(){return password;}
}
