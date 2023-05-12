package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Address_Id")
    private int id;

    @Embedded
    @Column(nullable = false)
    private AddressDetails addressDetails;

    @Column(nullable = false, name = "Default_Address")
    private boolean defaultAddress;
}
