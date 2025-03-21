package com.example.HotelBooking.services;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.dtos.RoomDTO;
import com.example.HotelBooking.enums.RoomType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    Response addRoom(RoomDTO roomDTO, MultipartFile imagefile) throws IOException;

    Response updateRoom(RoomDTO roomDTO, MultipartFile imagefile) throws IOException;

    Response getAllRooms ();

    Response getRoomById (Long id);

    Response deleteRoom (Long id);

    Response getAvailableRoom (LocalDate checkInDate, LocalDate checkOutDate, RoomType roomtype);


    List<RoomType> getAllRoomTypes();

    Response searchRooms (String input);


}
