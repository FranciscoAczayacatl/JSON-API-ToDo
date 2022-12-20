const express=require('express');
const path=require('path');
const fs=require('fs/promises');

const app=express();

app.use(express.json());

const jsonPath=path.resolve('./file/users.json');

app.get('/users', async (req, res)=>{
    //obtener json
    const jsonFile=await fs.readFile(jsonPath,'utf-8');
    //enviar la respuesta
    res.send(jsonFile);
});

//creacion de usuarios
app.post('/users', async (req, res)=>{
  //nos envian la informacion dentro del body de la peticion
  const user=req.body;
  //obtener el arreglo desde el json file
  const usersArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
  //geneara un nuevo id 
  const lastIndex=usersArray.length-1;
  const newId = usersArray[lastIndex].id+1;
  //agregar al ususario en el arreglo
  usersArray.push({...user,id:newId});
  //escribir la informacion en el json
  await fs.writeFile(jsonPath,JSON.stringify(usersArray));
  res.end();
});

//actualizar
app.put('/users', async (req, res)=>{
  const userId=req.body;
  const usersArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
  const userDelated=usersArray.filter(user=>user.id!==userId.id);
  const newArr=userDelated.concat(userId);
  await fs.writeFile(jsonPath,JSON.stringify(newArr));
  res.end();
})

//deleted
app.delete('/users',async (req, res)=>{
  const userId=req.body;
  const usersArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
  const userDelated=usersArray.filter(user=>user.id!==userId.id);
  await fs.writeFile(jsonPath,JSON.stringify(userDelated));
  res.end();

})

const PORT=8000;
app.listen(PORT,()=>{
  console.log(`servidor corriendo en el puerto ${PORT}`);
})