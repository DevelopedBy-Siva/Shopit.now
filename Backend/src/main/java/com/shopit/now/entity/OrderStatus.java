package com.shopit.now.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "Order_Status")
@Getter
@Setter
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;
    private boolean dispatched;
    private boolean shipped;
    private boolean delivered;
    private boolean cancelled;

    public OrderStatus() {
    }

    public OrderStatus(boolean dispatched, boolean shipped, boolean delivered, boolean cancelled) {
        this.dispatched = dispatched;
        this.shipped = shipped;
        this.delivered = delivered;
        this.cancelled = cancelled;
    }
}
