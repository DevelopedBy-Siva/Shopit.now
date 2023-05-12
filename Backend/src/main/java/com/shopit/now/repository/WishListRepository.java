package com.shopit.now.repository;

import com.shopit.now.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<Wishlist, Integer> {

    void deleteByIdAndUser_Id(int id, int userId);

    void deleteByProductIdAndUser_Id(int id, int userId);

    Wishlist findByProductIdAndUser_Id(int productId, int userId);

}
