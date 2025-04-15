import axios from 'axios'

export default class PostService {
    static async getPersons(userFullName, username) {
        return await axios.post('http://192.168.200.251:3001/api/data', {userFullName,username}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    static async get_recap(query) {
        const response = await axios.post('http://192.168.200.251:3001/api/get_recap',query, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const recapID = response.data
        const linkToDownload = document.createElement('a')
        linkToDownload.href = `http://192.168.200.251:3001/api/download_recap/${recapID}`
        linkToDownload.setAttribute('download',`recap_${recapID}.xlsx` )
        linkToDownload.addEventListener('click', ()=>{
        })
        linkToDownload.click()
    }
    static async login(creditionals) {
           return  await axios.post('http://192.168.200.251:3001/api/login', creditionals)
    }
}