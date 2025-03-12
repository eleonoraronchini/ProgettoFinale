package com.example.HotelBooking.services.impl;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.dtos.RoomDTO;
import com.example.HotelBooking.entities.Room;
import com.example.HotelBooking.enums.RoomType;
import com.example.HotelBooking.exceptions.InvalidBookingStateAndDateException;
import com.example.HotelBooking.exceptions.NotFoundExceptions;
import com.example.HotelBooking.repositories.RoomRepository;
import com.example.HotelBooking.services.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

    private static final String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-image";
    @Override
    public Response addRoom(RoomDTO roomDTO, MultipartFile imagefile) {
        Room roomToSave = modelMapper.map(roomDTO, Room.class);
        if (imagefile != null){
            String imagePath = saveImage(imagefile);
            roomToSave.setImageUrl(imagePath);
        }
        roomRepository.save(roomToSave);
        return Response.builder()
                .status(200)
                .message("Room successfully added")
                .build();
    }

    @Override
    public Response updateRoom(RoomDTO roomDTO, MultipartFile imagefile) {
        Room existingRoom = roomRepository.findById(roomDTO.getId())
                .orElseThrow(()->new NotFoundExceptions("Room not found"));
        if (imagefile != null && !imagefile.isEmpty()){
            String imagePath = saveImage(imagefile);
            existingRoom.setImageUrl(imagePath);
        }
        if(roomDTO.getRoomNumber() != null && roomDTO.getRoomNumber() >= 0){
            existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        }
        if(roomDTO.getPricePerNight() != null && roomDTO.getPricePerNight().compareTo(BigDecimal.ZERO)>= 0){
            existingRoom.setPricePerNight(roomDTO.getPricePerNight());
        }
        if(roomDTO.getCapacity() != null && roomDTO.getCapacity()>= 0){
            existingRoom.setCapacity(roomDTO.getCapacity());

        }
        if (roomDTO.getType() != null) existingRoom.setType(roomDTO.getType());

        if (roomDTO.getDescription() != null) existingRoom.setDescription(roomDTO.getDescription());

        roomRepository.save(existingRoom);
        return Response.builder()
                .status(200)
                .message("Room successfully updated")
                .build();
    }

    @Override
    public Response getAllRooms() {
        List<Room> rooms = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<RoomDTO> roomDTOList = modelMapper.map(rooms, new TypeToken<List<RoomDTO>>() {}.getType());
        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public Response getRoomById(Long id) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(()-> new NotFoundExceptions("Room not found"));
        RoomDTO roomDTO = modelMapper.map(existingRoom, RoomDTO.class);
        return Response.builder()
                .status(200)
                .message("success")
                .room(roomDTO)
                .build();
    }

    @Override
    public Response deleteRoom(Long id) {
        if (!roomRepository.existsById(id)){
            throw new NotFoundExceptions("Room not found");
        } roomRepository.deleteById(id);
        return Response.builder()
                .status(200)
                .message("Room deleted successfully")
                .build();
    }

    @Override
    public Response getAvailableRoom(LocalDate checkInDate, LocalDate checkOutDate, RoomType roomtype) {
        if (checkInDate.isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("Check-in date cannot be before today");
        } if (checkOutDate.isBefore(checkInDate)){
            throw new InvalidBookingStateAndDateException("Check-out date cannot be before check-in date");
        }
        if (checkInDate.isEqual(checkOutDate)){
            throw new InvalidBookingStateAndDateException("Check-in date cannot be equal to check-out date ");
        }
        List<Room> rooms = roomRepository.findAvailableRooms(checkInDate,checkOutDate,roomtype);

        List<RoomDTO> roomDTOList = modelMapper.map(rooms, new TypeToken<List<RoomDTO>>() {}.getType());
        return Response.builder()
                .status(200)
                .rooms(roomDTOList)
                .build();
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
       return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public Response searchRooms(String input) {
        List<Room> rooms = roomRepository.searchRooms(input);
        List<RoomDTO> roomDTOList = modelMapper.map(rooms, new TypeToken <List<RoomDTO>> (){}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();
    }

    private  String saveImage(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        File directory = new File(IMAGE_DIRECTORY);

        if (!directory.exists()) {
            directory.mkdir();
        }
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY + uniqueFileName;
        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile);
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
        return imagePath;
    }
}
