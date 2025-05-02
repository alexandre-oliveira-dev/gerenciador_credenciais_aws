const express = require('express')
const fs = require('fs')
const path = require('path')
const os = require('os');
const cors = require('cors')
const { exec } = require('child_process');

const app = express()

app.use((req, res, next) => {
  express.json()(req, res, next);
})

app.use(cors({allowedHeaders:"*"}))

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
  const match = response.match(/stage:(.+)/) || [];

  const stage = match[1]?.replace("\\n", " ").trim().replace('"',"");

  return res.json(stage)
})

app.post("/create", (req, res) => {
  
  const { body } = req;
  
  const filePath = path.join("./", 'credentials.json');

  try {

    let currentCredencials = '[]'
    
    if (!fs.existsSync(filePath)) {
      currentCredencials = '[]'
    } else {
       currentCredencials = Buffer.from(fs.readFileSync(filePath)).toString('utf-8') 
    }

    const currentCredencialsParsed = JSON.parse(currentCredencials) 

    currentCredencialsParsed?.push(body)
    
    fs.writeFileSync(filePath, Buffer.from(JSON.stringify(currentCredencialsParsed)), "utf-8")
    
    return res.json("credencial cadastrada com sucesso!").status(200)
    
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error)
    throw new Error(error)
  }

})

app.delete("/delete", (req, res) => {
  
  const { query } = req;
  
  const filePath = path.join("./", 'credentials.json');

  try {
    const currentCredencials = Buffer.from(fs.readFileSync(filePath)).toString('utf-8') || '[]'

    const currentCredencialsParsed = JSON.parse(currentCredencials) 
    
    fs.writeFileSync(filePath, Buffer.from(JSON.stringify(currentCredencialsParsed?.filter(i => i?.stage != query?.stage))), "utf-8")
    
    return res.json("credencial deletata com sucesso!").status(200)

  } catch (error) {
    throw new Error(error)
  }

})

app.get("/getAll", (req, res) => {
    const filePath = path.join("./", 'credentials.json');
  try {
    if (fs.existsSync(filePath)) {
      const currentCredencials = Buffer.from(fs.readFileSync(filePath)).toString('utf-8') || '[]'
      const currentCredencialsParsed = JSON.parse(currentCredencials)
      
      return res.json(currentCredencialsParsed).status(200)
    }
    return res.json([]).status(200)
    
    } catch (error) {
      throw new Error(error)
    }
})

app.get('/', (req, res) => {
  res.json({
    message: 'ok',
  });
});

app.listen(8000)