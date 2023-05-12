package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
public class ProductRatings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private int id;
    private double overallRating;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "rating_id")
    private List<UsersReview> usersReviews;
}
