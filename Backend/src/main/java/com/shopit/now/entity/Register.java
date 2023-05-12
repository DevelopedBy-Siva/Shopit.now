package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@Getter
@Setter
@ToString
@MappedSuperclass
public class Register {

    @Column(name = "Fullname", nullable = false)
    private String fullname;
    @Column(name = "Email_Id", nullable = false, unique = true)
    private String email;
    @Column(name = "Mobile_No", nullable = false)
    private String mobile;
    @Column(name = "Password", nullable = false)
    private String password;

}
