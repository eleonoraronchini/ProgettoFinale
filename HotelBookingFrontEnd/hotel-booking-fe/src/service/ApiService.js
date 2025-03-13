import axios from "axios";
import CryptoJs from "crypto-js";

export default class ApiService{
    static BASE_URL = "http://localhost:8080/api";
    static ENCRYPTION_KEY = "eleonora-secret-key";

    static encrypt(token){
        return CryptoJS.AES.encrypt(token,this.ENCRYPTION_KEY.toString());
    }

}
