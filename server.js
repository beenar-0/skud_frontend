import express from 'express'
import path from 'path'
import fs from "fs";
const app = express()
const PORT = 3000

const __dirname = path.resolve()
const processId = process.pid;
const content = `Номер процесса: ${processId}\n`;
fs.writeFileSync('log.txt', content, 'utf-8');

app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))


app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port 3001`)
})