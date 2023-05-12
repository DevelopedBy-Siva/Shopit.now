package com.shopit.now.repository;

import com.shopit.now.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    @Query("select o from Orders o where o.user.id=:uid ORDER BY o.orderStatus.shipped ASC , o.orderDate DESC")
    List<Orders> getALlOrders(@Param("uid") int uid);

    @Query("select count(o) from Orders o")
    int noOfOrders();

    @Query("select o from Orders o where o.orderStatus.cancelled=0 and o.orderStatus.delivered=0 order by o.orderStatus.shipped ASC , o.orderDate desc")
    List<Orders> getAdminOrders();

}
