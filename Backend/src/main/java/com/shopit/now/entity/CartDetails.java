package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "User_Cart")
@ToString
public class CartDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "product_id")
    private int productId;
    private String productName;
    private double totalPrice;
    private int itemCount;
    private boolean available;

    public CartDetails() {
    }

    public CartDetails(int productId, String productName, double totalPrice, int itemCount, boolean available) {
        this.productId = productId;
        this.productName = productName;
        this.totalPrice = totalPrice;
        this.itemCount = itemCount;
        this.available = available;
    }
}
