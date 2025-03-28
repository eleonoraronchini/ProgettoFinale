package com.example.HotelBooking.payments.stripe;
import com.example.HotelBooking.dtos.BookingDTO;
import com.example.HotelBooking.dtos.NotificationDTO;
import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.entities.Booking;
import com.example.HotelBooking.entities.PaymentEntity;
import com.example.HotelBooking.enums.NotificationType;
import com.example.HotelBooking.enums.PaymentGateway;
import com.example.HotelBooking.enums.PaymentStatus;
import com.example.HotelBooking.exceptions.NotFoundExceptions;
import com.example.HotelBooking.payments.stripe.dto.PaymentRequest;
import com.example.HotelBooking.repositories.BookingRepository;
import com.example.HotelBooking.repositories.PaymentRepository;
import com.example.HotelBooking.services.NotificationService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final ModelMapper modelMapper;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Value("${stripe.api.secret.key}")
    private String secretKey;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public String createPaymentIntent(PaymentRequest paymentRequest) {
        log.info("Inside createPaymentIntent()");
        Stripe.apiKey = secretKey;
        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundExceptions("Booking not found"));

        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED) {
            throw new NotFoundExceptions("Payment already made for this booking");
        }

        try {
            BigDecimal amount = booking.getTotalPrice();
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue())
                    .setCurrency("usd")
                    .putMetadata("bookingReference", bookingReference)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();

        } catch (Exception e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            throw new RuntimeException("Error creating payment intent: " + e.getMessage());
        }
    }

    public Response updatePaymentStatus(PaymentRequest paymentRequest) {
        log.info("Inside updatePaymentBooking()");
        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundExceptions("Booking not found"));

        PaymentEntity payment = new PaymentEntity();
        payment.setPaymentGateway(PaymentGateway.STRIPE);
        payment.setAmount(paymentRequest.getAmount());
        payment.setTransactionId(paymentRequest.getTransactionId());
        payment.setPaymentStatus(paymentRequest.isSuccess() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setBookingReference(bookingReference);
        payment.setUser(booking.getUser());

        if (!paymentRequest.isSuccess()) {
            payment.setFailureReason(paymentRequest.getFailureReason());
        }

        paymentRepository.save(payment);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(booking.getUser().getEmail())
                .type(NotificationType.EMAIL)
                .bookingReference(bookingReference)
                .build();

        log.info("About to send notification inside updatePaymentBooking");

        if (paymentRequest.isSuccess()) {
            booking.setPaymentStatus(PaymentStatus.COMPLETED);
            bookingRepository.save(booking);
            notificationDTO.setSubject("Pagamento Confermato - PunPun Lodge");
            notificationDTO.setBody("Gentile Cliente,\n\n" +
                    "Il pagamento per la tua prenotazione con codice " + bookingReference + " è stato completato con successo.\n\n" +
                    "Grazie per aver scelto PunPun Lodge.\n\n" +
                    "Cordiali saluti,\n" +
                    "Lo Staff di PunPun Lodge");
            notificationService.sendEmail(notificationDTO);
        } else {
            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);
            notificationDTO.setSubject("Pagamento Non Riuscito - PunPun Lodge");
            notificationDTO.setBody("Gentile Cliente,\n\n" +
                    "Il pagamento per la tua prenotazione con codice " + bookingReference + " non è andato a buon fine.\n\n" +
                    "Motivo: " + paymentRequest.getFailureReason() + "\n\n" +
                    "Ti preghiamo di riprovare utilizzando questo link: " + frontendUrl + "/payment/" + bookingReference + "/" + booking.getTotalPrice() + "\n\n" +
                    "Se il problema persiste, contatta il nostro servizio clienti.\n\n" +
                    "Cordiali saluti,\n" +
                    "Lo Staff di PunPun Lodge");
            notificationService.sendEmail(notificationDTO);
        }

        return Response.builder()
                .status(200)
                .message(paymentRequest.isSuccess() ? "Payment successful" : "Payment failed")
                .build();
    }


    public Response checkPaymentStatus(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundExceptions("Booking not found"));

        // Usa il modelMapper per convertire l'oggetto Booking in BookingDTO
        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);

        return Response.builder()
                .status(200)
                .message("Success")
                .booking(bookingDTO)
                .build();
    }
}
