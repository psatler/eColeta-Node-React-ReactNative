import axios from 'axios'

// when on localhost, use the ip of your machine, with the port to your local api
const api = axios.create({
  baseURL: 'http://192.168.15.4:3333',
})

export default api;