package com.example.HotelBooking.payments.stripe;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.entities.PaymentEntity;
import com.example.HotelBooking.payments.stripe.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<String> createaPaymentIntent(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.createPaymentIntent(paymentRequest));
    }

    @PutMapping("/update")
    public void updatePaymentBooking (@RequestBody PaymentRequest paymentRequest){
        paymentService.updatePaymentBooking(paymentRequest);
    }
}
