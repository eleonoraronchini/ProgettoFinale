import axios from "axios";
import CryptoJs from "crypto-js";

export default class ApiService {
  static BASE_URL = "http://localhost:8080/api";
  static ENCRYPTION_KEY = "eleonora-secret-key";

  static encrypt(token) {
    return CryptoJs.AES.encrypt(token, this.ENCRYPTION_KEY.toString());
  }

  static decrypt(token) {
    const bytes = CryptoJs.AES.decrypt(token, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJs.enc.Utf8);
  }

  static saveToken(token) {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem("token", encryptedToken);
  }

  static getToken() {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;
    return this.decrypt(encryptedToken);
  }

  static saveRole(role) {
    const encryptedRole = this.encrypt(role);
    localStorage.setItem("role", encryptedRole);
  }

  static getRole() {
    const encryptedRole = localStorage.getItem("role");
    if (!encryptedRole) return null;
    return this.decrypt(encryptedRole);
  }

  static clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  /* AUTH AND USERS API METHODS */

  //AUTH
  static async registerUser(registrationData) {
    const resp = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registrationData
    );
    return resp.data;
  }

  static async loginUser(loginData) {
    const resp = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
    return resp.data;
  }

  //USERS
  static async myProfile() {
    const resp = await axios.get(`${this.BASE_URL}/users/account`, {
      headers: this.getHeader()
    });
    return resp.data;
  }

  static async myBookings() {
    const resp = await axios.get(`${this.BASE_URL}/users/bookings`, {
      headers: this.getHeader()
    });
    return resp.data;
  }

  static async deleteAccount() {
    const resp = await axios.delete(`${this.BASE_URL}/users/delete`, {
      headers: this.getHeader()
    });
    return resp.data;
  }

  //ROOMS
  static async addRoom(formData) {
    const resp = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data"
      }
    });
    return resp.data;
  }

  static async getRoomTypes() {
    const resp = await axios.get(`${this.BASE_URL}/rooms/types`);
    return resp.data;
  }

  static async getAllRooms() {
    const resp = await axios.get(`${this.BASE_URL}/rooms/all`);
    return resp.data;
  }

  static async getRoomById(roomId) {
    const resp = await axios.get(`${this.BASE_URL}/rooms/${roomId}`);
    return resp.data;
  }

  static async deleteRoom(roomId) {
    const resp = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader()
    });
    return resp.data;
  }

  static async updateRoom(formData) {
    const resp = await axios.put(`${this.BASE_URL}/rooms/update`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data"
      }
    });
    return resp.data;
  }

  static async getAvailableRooms(checkInDate, checkOutDate, roomType) {
    const resp =
      await axios.get(`${this.BASE_URL}/rooms/available?checkInDate=${checkInDate} &
        checkOutDate=${checkOutDate} &roomType=${roomType}`);

    return resp.data;
  }

  //BOOKINGS
  static async getBookingByReference(bookingCode){
    const resp = await axios.get(`${this.BASE_URL}/bookings/${bookingCode}`);
    return resp.data;
  }


  static async bookRoom (booking){
    const resp = await axios.post(`${this.BASE_URL}/bookings/`, booking,{
        headers: this.getHeader()
    });
    return resp.data;
  }

  static async getAllBookings (){
    const resp = await axios.get(`${this.BASE_URL}/bookings/all`,{
        headers: this.getHeader()
    });
    return resp.data;
  }

  static async updateBooking(booking){
    const resp = await axios.put(`${this.BASE_URL}/bookings/update`,booking,{
        headers: this.getHeader()
    });
    return resp.data;
  }

  //PAYMENT
  //function to create payment intent
  static async proceedForPayment(body){
    const resp = await axios.post(`${this.BASE_URL}/payments/pay`, body, {
        headers: this.getHeader()
    });
    return resp.data;  //return the strip transaction id for this transaction
  }

  //to update payment when it has been completed
  static async updateBookingPayment(body){
    const resp = await axios.put(`${this.BASE_URL}/payments/update`, body, {
        headers: this.getHeader()
    });
    return resp.data;
  }

  //AUTHENTICATION CHECKER
  static logout(){
    this.clearAuth();
  }

  static isAuthenticated(){
    const token = this.getToken();
    return !!token;
  }

  static isAdmin(){
    const role = this.getRole();
    return role === "ADMIN";
  }

  static isCustomer(){
    const role = this.getRole();
    return role === "CUSTOMER";
  }

}

