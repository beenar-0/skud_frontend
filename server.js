import express from 'express'
import path from 'path'
const app = express()
const PORT = 3000

app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT)