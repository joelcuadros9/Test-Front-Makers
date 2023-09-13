import axios from 'axios';

export class StudentService{

    static baseUrl = "http://localhost:8080/api/v1/students"

    static getAll(){
        return Promise.resolve(axios.get(this.baseUrl).then(res => res.data));
    }

    static save(student) {
        return axios.post(this.baseUrl, student).then(res => res.data);
    }

    static update(student) {
        return axios.put(this.baseUrl, student).then(res => res.data);
    }

    static delete(id) {
        return axios.delete(this.baseUrl + "/"+id).then(res => res.data);
    }

}
