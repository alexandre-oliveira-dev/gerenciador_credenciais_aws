const express = require('express')
const fs = require('fs')
const path = require('path')
const os = require('os');

const app = express()

app.use((req, res, next) => {
  express.json()(req, res, next);
})

app.post('/changeCredential',  (req, res) => {

  const { body } = req
  const file = body.file 

  const homeDir = os.homedir();

  const awsDir = path.join(homeDir, '.aws');
  const filePath = path.join(awsDir, 'credentials');

  try {      
    fs.writeFileSync(filePath, Buffer.from(file),'utf-8')
    res.json("credencial alterada com sucesso!")
  } catch (error) {
    console.log(`Erro ao salvar aquivo: ${error}`)
    res.json(`${error}`).statusCode = 500
  }
});

app.get("/current", (req, res) => {
    const homeDir = os.homedir();

  const awsDir = path.join(homeDir, '.aws');
  const filePath = path.join(awsDir, 'credentials');  
  const currentAws = fs.readFileSync(filePath)

  const decode = new TextDecoder()
  const response = JSON.stringify(decode.decode(Buffer.from(currentAws),'utf-8'))
  const match = response.match(/stage:(.+)/);

  const stage = match[1].replace("\\n", " ").trim().replace('"',"");

  return res.json(stage)
})

app.get('/', (req, res) => {
  res.json({
    message: 'ok',
  });
});

app.listen(8000)