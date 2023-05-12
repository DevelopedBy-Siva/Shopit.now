package com.shopit.now.repository;

import com.shopit.now.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("select n from Notification n where n.seen=0")
    List<Notification> getAllNotification();
}
