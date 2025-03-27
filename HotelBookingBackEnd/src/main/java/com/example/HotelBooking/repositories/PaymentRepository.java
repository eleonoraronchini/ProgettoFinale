package com.example.HotelBooking.repositories;

import com.example.HotelBooking.entities.PaymentEntity;
import com.example.HotelBooking.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<PaymentEntity,Long> {
    @Modifying
    @Query("DELETE FROM PaymentEntity p WHERE p.user = :user")
    void deleteByUser(@Param("user") User user);
}

