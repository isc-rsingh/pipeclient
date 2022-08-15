import axios from 'axios';


export const baseURL = 'http://3.81.189.215:52773';
export default axios.create({
    baseURL,
});