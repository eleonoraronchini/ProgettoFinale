package com.example.HotelBooking.controllers;

import com.example.HotelBooking.dtos.BookingDTO;
import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings (){
        return ResponseEntity.ok(bookingService.getAllBookings());
    }


    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER')")
    public ResponseEntity<Response> createBooking (@RequestBody BookingDTO bookingDTO){
        return ResponseEntity.ok(bookingService.createBooking(bookingDTO));
    }

    @GetMapping("/{reference}")
    public ResponseEntity<Response> findBookingByReference(@PathVariable String reference){
        return ResponseEntity.ok(bookingService.findBookingReferenceNo(reference));
    }
    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateBooking (@RequestBody BookingDTO bookingDTO){
        return ResponseEntity.ok(bookingService.updateBooking(bookingDTO));
    }
}
