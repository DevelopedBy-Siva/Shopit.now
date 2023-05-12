package com.shopit.now.repository;

import com.shopit.now.entity.UserProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileImageRepository extends JpaRepository<UserProfileImage, Integer> {

}
