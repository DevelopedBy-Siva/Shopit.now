package com.shopit.now.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "Orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;
    private String orderDate;
    private String deliveryDate;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    @MapsId
    private OrderImage orderImage;
    @Embedded
    private ModeOfPayment modeOfPayment;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    @MapsId
    private ItemDetails itemDetails;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    @MapsId
    private OrderStatus orderStatus;
    @Embedded
    private BillingAddress billingAddress;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
