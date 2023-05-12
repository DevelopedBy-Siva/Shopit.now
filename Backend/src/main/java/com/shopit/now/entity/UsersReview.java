package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "userReview")
public class UsersReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String name;
    @Column(nullable = false)
    private int rating;
    @Column(nullable = false)
    private String review;
}
