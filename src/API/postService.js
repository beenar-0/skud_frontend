import axios from 'axios'

export default class PostService {
    static async getPersons() {
        return await axios.get('http://localhost:3001/api/data')
    }

    static async get_recap(query) {
        const response = await axios.post('http://localhost:3001/api/get_recap',query, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const recapID = response.data
        const linkToDownload = document.createElement('a')
        linkToDownload.href = `http://localhost:3001/api/download_recap/${recapID}`
        linkToDownload.setAttribute('download',`recap_${recapID}.xlsx` )
        linkToDownload.addEventListener('click', ()=>{
        })
        linkToDownload.click()
    }
}