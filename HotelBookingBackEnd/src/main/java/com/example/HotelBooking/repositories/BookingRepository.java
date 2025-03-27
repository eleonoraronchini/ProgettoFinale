package com.example.HotelBooking.repositories;

import com.example.HotelBooking.entities.Booking;
import com.example.HotelBooking.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);


    Optional<Booking> findByBookingReference(String bookingReference);


    @Query("""
               SELECT CASE WHEN COUNT(b) = 0 THEN true ELSE false END
                FROM Booking b
                WHERE b.room.id = :roomId
                  AND :checkInDate <= b.checkOutDate
                  AND :checkOutDate >= b.checkInDate
                  AND b.bookingStatus IN ('BOOKED', 'CHECKED_IN')
            """)
    boolean isRoomAvailable(@Param("roomId") Long roomId,
                            @Param("checkInDate") LocalDate checkInDate,
                            @Param("checkOutDate") LocalDate checkOutDate);

    @Modifying
    @Query("DELETE FROM Booking b WHERE b.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}


