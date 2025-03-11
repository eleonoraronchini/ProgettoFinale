package com.example.HotelBooking.exceptions;

import com.example.HotelBooking.dtos.Response;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleAllUnknowExceptions(Exception ex) {
        Response response = Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundExceptions.class)
    public ResponseEntity<Response> handleNotFoundException(NotFoundExceptions ex) {
        Response response = Response.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(NameValueRequiredException.class)
    public ResponseEntity<Response> handleNameValueRequiredException(NameValueRequiredException ex) {
        Response response = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Response> handleInvalidCredentialException(InvalidCredentialsException ex) {
        Response response = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidBookingStateAndDateException.class)
    public ResponseEntity<Response> handleInvalidBookingStateAndDateException(InvalidBookingStateAndDateException ex) {
        Response response = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}


