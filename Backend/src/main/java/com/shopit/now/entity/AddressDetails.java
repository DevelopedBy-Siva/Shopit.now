package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Getter
@Setter
@Embeddable
public class AddressDetails {

    @Column(nullable = false, name = "Houseno_or_Street")
    private String houseNo;

    @Column(nullable = false, name = "Town")
    private String town;

    @Column(nullable = false, name = "City")
    private String city;

    @Column(nullable = false, name = "State")
    private String state;

    @Column(nullable = false, name = "Pincode")
    private String pincode;

}
