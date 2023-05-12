package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue
    private int id;
    private int orderId;
    private String productName;
    private boolean seen;

    public Notification() {
    }

    public Notification(int orderId, String productName, boolean seen) {
        this.orderId = orderId;
        this.productName = productName;
        this.seen = seen;
    }
}
