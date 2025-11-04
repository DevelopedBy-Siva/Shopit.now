package com.shopit.now.entity;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "Order_Item_Details")
public class ItemDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;
    private int productId;
    private String productName;
    private int itemCount;
    private String totalPrice;
    private double total_co2_emitted;
    private double total_co2_saved;
}
