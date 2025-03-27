import axios from "axios";
import CryptoJs from "crypto-js";

export default class ApiService {
  static BASE_URL = "http://localhost:8080/api";
  static ENCRYPTION_KEY = "eleonora-secret-key";

  // Encrypt the token
  static encrypt(token) {
    return CryptoJs.AES.encrypt(token, this.ENCRYPTION_KEY.toString()).toString();
  }

  // Decrypt the token
  static decrypt(token) {
    const bytes = CryptoJs.AES.decrypt(token, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJs.enc.Utf8);
  }

  // Save token to localStorage
  static saveToken(token) {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem("token", encryptedToken);
  }

  // Get token from localStorage
  static getToken() {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;
    try {
      return this.decrypt(encryptedToken);
    } catch (error) {
      console.error("Error decrypting the token:", error);
      return null;
    }
  }

  // Save user role to localStorage
  static saveRole(role) {
    const encryptedRole = this.encrypt(role);
    localStorage.setItem("role", encryptedRole);
  }

  // Get user role from localStorage
  static getRole() {
    const encryptedRole = localStorage.getItem("role");
    if (!encryptedRole) return null;
    try {
      return this.decrypt(encryptedRole);
    } catch (error) {
      console.error("Error decrypting the role:", error);
      return null;
    }
  }

  // Clear authentication data from localStorage
  static clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  // Get headers for authenticated requests
  static getHeader() {
    const token = this.getToken();
    if (!token) {
      console.error("No token found for authorization.");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  /* AUTH AND USERS API METHODS */
  // Register a new user
  static async registerUser(registrationData) {
    try {
      const resp = await axios.post(
        `${this.BASE_URL}/auth/register`,
        registrationData
      );
      return resp.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  // Login user
  static async loginUser(loginData) {
    try {
      const resp = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
      return resp.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  // Get profile of the authenticated user
  static async myProfile() {
    try {
      const resp = await axios.get(`${this.BASE_URL}/users/account`, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  // Get all bookings of the authenticated user
  static async myBookings() {
    try {
      const resp = await axios.get(`${this.BASE_URL}/users/bookings`, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  // Delete user account
  static async deleteAccount() {
    try {
      const resp = await axios.delete(`${this.BASE_URL}/users/delete`, {
        headers: this.getHeader(),
      });
      return resp.data;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userData) {
    try {
      const resp = await axios.put(`${this.BASE_URL}/users/update`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true, 
      });
      return resp.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // ROOM API METHODS
  static async addRoom(formData) {
    try {
      const resp = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data"
        }
      });
      return resp.data;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  }

  static async getRoomTypes() {
    try {
      const resp = await axios.get(`${this.BASE_URL}/rooms/types`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching room types:", error);
      throw error;
    }
  }

  static async getAllRooms() {
    try {
      const resp = await axios.get(`${this.BASE_URL}/rooms/all`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  }

  static async getRoomById(roomId) {
    try {
      const resp = await axios.get(`${this.BASE_URL}/rooms/${roomId}`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      throw error;
    }
  }

  static async deleteRoom(roomId) {
    try {
      const resp = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  }

  static async updateRoom(formData) {
    try {
      const resp = await axios.put(`${this.BASE_URL}/rooms/update`, formData, {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data"
        }
      });
      return resp.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  }

  static async getAvailableRooms(checkInDate, checkOutDate, roomType) {
    try {
      const resp = await axios.get(`${this.BASE_URL}/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      throw error;
    }
  }

  // BOOKING API METHODS
  static async getBookingByReference(bookingCode) {
    try {
      const resp = await axios.get(`${this.BASE_URL}/bookings/${bookingCode}`);
      return resp.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  }

  static async bookRoom(booking) {
    try {
      const resp = await axios.post(`${this.BASE_URL}/bookings/create`, booking, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error booking room:", error);
      throw error;
    }
  }

  static async getAllBookings() {
    try {
      const resp = await axios.get(`${this.BASE_URL}/bookings/all`, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw error;
    }
  }

  static async updateBooking(booking) {
    try {
      const resp = await axios.put(`${this.BASE_URL}/bookings/update`, booking, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  

  // PAYMENT API METHODS
  static async proceedForPayment(body) {
    try {
      const resp = await axios.post(`${this.BASE_URL}/payments/pay`, body, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  static async updateBookingPayment(body) {
    try {
      const resp = await axios.put(`${this.BASE_URL}/payments/update`, body, {
        headers: this.getHeader()
      });
      return resp.data;
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  }

  // AUTHENTICATION CHECKER
  static logout() {
    this.clearAuth();
  }

  static isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  static isAdmin() {
    const role = this.getRole();
    return role === "ADMIN";
  }

  static isCustomer() {
    const role = this.getRole();
    return role === "CUSTOMER";
  }
}
