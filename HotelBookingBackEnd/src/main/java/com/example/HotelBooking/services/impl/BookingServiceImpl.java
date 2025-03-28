package com.example.HotelBooking.services.impl;

import com.example.HotelBooking.dtos.BookingDTO;
import com.example.HotelBooking.dtos.NotificationDTO;
import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.entities.Booking;
import com.example.HotelBooking.entities.Room;
import com.example.HotelBooking.entities.User;
import com.example.HotelBooking.enums.BookingStatus;
import com.example.HotelBooking.enums.PaymentStatus;
import com.example.HotelBooking.exceptions.InvalidBookingStateAndDateException;
import com.example.HotelBooking.exceptions.NotFoundExceptions;
import com.example.HotelBooking.repositories.BookingRepository;
import com.example.HotelBooking.repositories.RoomRepository;
import com.example.HotelBooking.services.BookingCodeGenerator;
import com.example.HotelBooking.services.BookingService;
import com.example.HotelBooking.services.NotificationService;
import com.example.HotelBooking.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private  final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final BookingCodeGenerator bookingCodeGenerator;

    private BigDecimal calculateTotalPrice(Room room, BookingDTO bookingDTO){
        BigDecimal pricePerNight = room.getPricePerNight();
        long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        return pricePerNight.multiply(BigDecimal.valueOf(days));
    }

    @Override
    public Response getAllBookings() {
        List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC,"id"));
        List<BookingDTO> bookingDTOList = modelMapper.map(bookingList, new TypeToken<List<BookingDTO>>() {}.getType());

        for(BookingDTO bookingDTO: bookingDTOList){
            bookingDTO.setUser(null);
            bookingDTO.setRoom(null);
        }
        return Response.builder()
                .status(200)
                .message("success")
                .bookings(bookingDTOList)
                .build();

    }

    @Override
    public Response createBooking(BookingDTO bookingDTO) {
        User currentUser = userService.getCurrentLoggedInUser();
        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new NotFoundExceptions("Room not found"));

        // Controlli di validità delle date...

        BigDecimal totalPrice = calculateTotalPrice(room, bookingDTO);
        String bookingReference = bookingCodeGenerator.generateBookingReference();

        Booking booking = new Booking();
        booking.setUser(currentUser);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(totalPrice);
        booking.setBookingReference(bookingReference);
        booking.setBookingStatus(BookingStatus.BOOKED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        // Qui il link di pagamento corretto
        String paymentUrl =  "http://localhost:8080" + "/payment/" + bookingReference + "/" + totalPrice;
        log.info("PAYMENT LINK: {} ", paymentUrl);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(currentUser.getEmail())
                .subject("Conferma Prenotazione - PunPun Lodge")
                .body(String.format("Gentile %s,\n\n", currentUser.getFirstName()) +
                        "La tua prenotazione è stata creata con successo.\n\n" +
                        String.format("Dettagli della prenotazione:\n") +
                        String.format("- Codice: %s\n", bookingReference) +
                        String.format("- Check-in: %s\n", bookingDTO.getCheckInDate()) +
                        String.format("- Check-out: %s\n", bookingDTO.getCheckOutDate()) +
                        String.format("- Prezzo totale: €%.2f\n\n", totalPrice) +
                        "Per completare la prenotazione, per favore procedi con il pagamento utilizzando il seguente link:\n" +
                        paymentUrl + "\n\n" +
                        "Grazie per aver scelto PunPun Lodge.\n\n" +
                        "Cordiali saluti,\n" +
                        "Lo Staff di PunPun Lodge")
                .bookingReference(bookingReference)
                .build();

        notificationService.sendEmail(notificationDTO);

        return Response.builder()
                .status(200)
                .message("Booking is successful")
                .booking(bookingDTO)
                .build();
    }


    @Override
    public Response findBookingReferenceNo(String bookingReference) {
      Booking booking = bookingRepository.findByBookingReference(bookingReference)
              .orElseThrow(()->new NotFoundExceptions("Booking with reference No: " + bookingReference + "not found"));

      BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
      return Response.builder()
              .status(200)
              .message("success")
              .booking(bookingDTO)
              .build();
    }

    @Override
    public Response updateBooking(BookingDTO bookingDTO) {
        if (bookingDTO.getId()== null) throw new NotFoundExceptions("Booking id is required");
        Booking existingBooking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(()-> new NotFoundExceptions("Booking not found"));
        if (bookingDTO.getBookingStatus() != null){
            existingBooking.setBookingStatus (bookingDTO.getBookingStatus());
        }
        if (bookingDTO.getPaymentStatus() != null){
            existingBooking.setPaymentStatus(bookingDTO.getPaymentStatus());
        }
        bookingRepository.save(existingBooking);

        return Response.builder()
                .status(200)
                .message("Booking updated successfully")
                .build();
    }
}
