package com.shopit.now.repository;

import com.shopit.now.entity.Advertisement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Integer> {

    @Query("select a from Advertisement a order by a.productName asc ")
    List<Advertisement> getAllAd();

    Advertisement findByProductId(int id);

    @Query("select a from Advertisement a")
    List<Advertisement> adToDisplay(Pageable pageable);

}
