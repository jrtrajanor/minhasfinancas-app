import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'https://jrfinancas-api.herokuapp.com/', 
    //'http://localhost:8080',
    headers:{'x-apikey': '59a7ad19f5a9fa0808f11931',
             'Access-Control-Allow-Origin' : '*',
             'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }
});

class ApiService{
    constructor(apiurl){
       this.apiurl = apiurl;
    }

    post(url, objeto){
        const requestUrl = `${this.apiurl}${url}`;

        return httpClient.post(requestUrl, objeto);
    }

    put(url, objeto){
        const requestUrl = `${this.apiurl}${url}`;
        return httpClient.put(requestUrl, objeto);
    }

    delete(url){
        const requestUrl = `${this.apiurl}${url}`;
        return httpClient.delete(requestUrl);
    }

    get(url){
        const requestUrl = `${this.apiurl}${url}`;

        console.log('Headers: '+ httpClient.defaults.headers);
        console.log('Post: '+ httpClient.defaults.headers.post);
        console.log('Post: '+ httpClient.defaults);
        console.log('Post: '+ httpClient.headers);

        return httpClient.get(requestUrl);
    }
}

export default ApiService;