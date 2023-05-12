package com.shopit.now.repository;

import com.shopit.now.entity.CartDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartDetails, Integer> {

}
