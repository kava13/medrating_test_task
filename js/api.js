export class API {

    constructor() {

        this.URL = 'https://json.medrating.org';

    }

    getData = async (url) => {

        const res = await fetch(url);
        
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Not enought data from : ${url}`);
        }

    }

    getUsers = () => {
        return this.getData(`${this.URL}/users`)
    }

    getAlbumsByUser = (userID) => {
        return this.getData(`${this.URL}/albums?userId=${userID}`)
    }

    getPhotosByAlbum = (albumID) => {
        return this.getData(`${this.URL}/photos?albumId=${albumID}`)
    }
}