package com.example.HotelBooking.services.impl;
import com.example.HotelBooking.dtos.*;
import com.example.HotelBooking.entities.Booking;
import com.example.HotelBooking.enums.UserRole;
import com.example.HotelBooking.exceptions.InvalidCredentialsException;
import com.example.HotelBooking.exceptions.NotFoundExceptions;
import com.example.HotelBooking.repositories.BookingRepository;
import com.example.HotelBooking.services.NotificationService;
import org.modelmapper.ModelMapper;
import com.example.HotelBooking.entities.User;
import com.example.HotelBooking.repositories.UserRepository;
import com.example.HotelBooking.security.JwtUtils;
import com.example.HotelBooking.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ModelMapper modelMapper;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;


    @Override
    public Response registerUser(RegistrationRequest registrationRequest) {
        UserRole role = UserRole.CUSTOMER;
        if(registrationRequest.getRole() != null){
            role = registrationRequest.getRole();
        }
        String hashedPassword = passwordEncoder.encode(registrationRequest.getPassword());
        User userToSave = User.builder()
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .email(registrationRequest.getEmail())
                .password(hashedPassword)
                .phoneNumber(registrationRequest.getPhoneNumber())
                .role(role)
                .isActive(Boolean.TRUE)
                .build();
        userRepository.save(userToSave);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(userToSave.getEmail())
                .subject("Welcome to our guests!")
                .body( String.format("Hi " + userToSave.getFirstName() + ",\n\nYour registration was successful.") + "\n"+ "\n" +
                        String.format("Thank you," + "\n" + "Punpun Lodge Staff."))
                .build();

        notificationService.sendEmail(notificationDTO);

        return Response.builder()
                .status(200)
                .message("user created successfully")
                .build();

    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()-> new NotFoundExceptions("Email not found"));
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Password doesn't match");
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return Response.builder()
                .status(200)
                .message("User logged in successfully")
                .role(user.getRole())
                .token(token)
                .isActive(user.getIsActive())
                .expirationTime("6 months")
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<UserDTO> userDTOList = modelMapper.map(users, new TypeToken<List<UserDTO>>(){}.getType());
        return Response.builder()
                .status(200)
                .message("success")
                .users(userDTOList)
                .build();
    }

    @Override
    public Response getOwnAccountDetails() {
      String email = SecurityContextHolder.getContext().getAuthentication().getName();
      User user = userRepository.findByEmail(email)
              .orElseThrow(()-> new NotFoundExceptions("User not found"));
      log.info("Inside getOwnAccountDetails user email is {} ", email);
      UserDTO userDTO = modelMapper.map(user,UserDTO.class);
      return Response.builder()
              .status(200)
              .message("success")
              .user(userDTO)
              .build();
    }

    @Override
    public User getCurrentLoggedInUser() {
       String email = SecurityContextHolder.getContext().getAuthentication().getName();
       return userRepository.findByEmail(email).orElseThrow(()-> new NotFoundExceptions("User not found"));
    }

    @Override
    public Response updateOwnAccount(UserDTO userDTO) {
        User existingUser = getCurrentLoggedInUser();
        log.info("Inside update user");
        if(userDTO.getEmail() != null ) existingUser.setEmail(userDTO.getEmail());
        if (userDTO.getFirstName() != null) existingUser.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName()!= null) existingUser.setLastName(userDTO.getLastName());
        if (userDTO.getPhoneNumber() != null) existingUser.setPhoneNumber(userDTO.getPhoneNumber());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()){
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        }
        userRepository.save(existingUser);
        return Response.builder()
                .status(200)
                .message("User updated successfully")
                .build();


    }

    @Override
    public Response deleteOwnAccount() {
       User user = getCurrentLoggedInUser();
       userRepository.delete(user);
        return Response.builder()
                .status(200)
                .message("User deleted successfully")
                .build();
    }

    @Override
    public Response getMyBookingHistory() {
        User user = getCurrentLoggedInUser();
        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        List<BookingDTO> bookingDTOList = modelMapper.map(bookings, new TypeToken<List<UserDTO>>(){}.getType());
        return Response.builder()
                .status(200)
                .message("success")
                .bookings(bookingDTOList)
                .build();


    }
}
