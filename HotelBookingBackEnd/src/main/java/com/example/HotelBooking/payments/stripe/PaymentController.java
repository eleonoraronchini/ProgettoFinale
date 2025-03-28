package com.example.HotelBooking.payments.stripe;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.payments.stripe.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.HotelBooking.payments.stripe.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequiredArgsConstructor
public class PaymentController {
      private  final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.createPaymentIntent(paymentRequest));
    }

    @PutMapping("/update")
    public ResponseEntity<Response> updatePaymentBooking(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentRequest));
    }

    @GetMapping("/check/{bookingReference}")
    public ResponseEntity<Response> checkPayment(@PathVariable String bookingReference){
        return ResponseEntity.ok(paymentService.checkPaymentStatus(bookingReference));
    }
}
