package com.talentstack.api.model;

/**
 * UserSiteId is the composite primary key for site connection records.
 *
 * It uniquely identifies a connection by user id and source number and implements
 * equals/hashCode so JPA can correctly track entity identity.
 */

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserSiteId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "source_num")
    private Integer sourceNum;

    public UserSiteId() {
    }

    public UserSiteId(Long userId, Integer sourceNum) {
        this.userId = userId;
        this.sourceNum = sourceNum;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getSourceNum() {
        return sourceNum;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSiteId that = (UserSiteId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(sourceNum, that.sourceNum);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, sourceNum);
    }
}
