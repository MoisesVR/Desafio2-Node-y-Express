const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

app.use(express.json())

app.listen(3000, console.log("Servidor encedido"))

app.get('/', (req, res) => {
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    res.sendFile(path.resolve(__dirname, "index.html"))
})

app.get('/repertorio', (req, res) => {
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    res.send(repertorio)
})

/* CRUD */

/* Crea nueva cancion */

app.post("/canciones", (req,res) =>{
    const cancion = req.body
    const cancionId = parseInt(cancion.id)
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    const repertorioActualizado = repertorio.filter((cancion)=> cancion.id === cancionId)
    if(repertorioActualizado.length===0 && cancion.id && cancion.titulo && cancion.artista && cancion.tono){
        repertorio.push({
            id: parseInt(cancion.id),
            titulo: cancion.titulo,
            artista: cancion.artista,
            tono: cancion.tono
        })
        fs.writeFileSync("repertorio.json", JSON.stringify(repertorio))
        res.send(cancion)
    }else if(repertorioActualizado.length>=1){
        res.status(400)
        res.send({"Mensaje":"El id ya existe"})
    }
    else{
        res.status(400)
        res.send({ "Mensaje":"Debe llenar todos los campos"})
    }
})

/* Devuelve todas las canciones */
app.get("/canciones", (req,res) => {
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    res.send(repertorio)
})

/* Actualiza el repertorio */
app.put("/canciones/:id",(req,res) => {
    const cancion = req.body
    const cancionId = parseInt(req.params.id)
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    const cancionEncontrada = repertorio.filter((cancion) => cancion.id === cancionId)
    if(cancionEncontrada.length === 0){
        res.status(404)
        res.send()
        return
    }
    const repertorioActualizado = repertorio.filter((cancion) => cancion.id !== cancionId)
    repertorioActualizado.push({
        id: cancion.id,
        titulo: cancion.titulo,
        artista: cancion.artista,
        tono: cancion.tono
    })
    fs.writeFileSync("repertorio.json", JSON.stringify(repertorioActualizado))
    res.send(cancion)
})

/* Elimina una cancion */
app.delete("/canciones/:id",(req,res) => {
    const cancionId = parseInt(req.params.id)
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json"))
    const cancionEncontrada = repertorio.filter((cancion) => cancion.id === cancionId)
    if(cancionEncontrada.length === 0){
        res.status(404)
        res.send({"Mensaje": "La cancion no existe"})
        return
    }
    const repertorioActualizado = repertorio.filter((cancion) => cancion.id !== cancionId)
    fs.writeFileSync("repertorio.json", JSON.stringify(repertorioActualizado))
    res.status(200)
    res.send({ "Mensaje":"La cancion fue eliminada"})
})