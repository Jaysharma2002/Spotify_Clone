import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import bodyParser from 'body-parser'
import cors from 'cors'
const app=new express()
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:5173',
}))
app.post('/login',(req,res)=>{
    const code=req.body.code
    if(!code){
        return res.status(404).json({message:"No Authorization code"})
    }
    const spotifyapi=new SpotifyWebApi({
        redirectUri:'http://localhost:5173',
        clientId:'', //Add your spotify developer clientId
        clientSecret:'' //Add your spotify developer clientSecret
    })
    spotifyapi.authorizationCodeGrant(code).then(data=>{
        res.json({
            accessToken:data.body.access_token,
            refreshToken:data.body.refresh_token,
            expiresIn:data.body.expires_in,
        })
    }).catch(err=>
    {
        console.error("Error",err)
    })
})

app.post('/refresh',(req,res)=>{
    const refreshToken=req.body.refreshToken
    const spotifyapi=new SpotifyWebApi({
        redirectUri:'http://localhost:5173',
        clientId:'',  //Add your spotify developer clientId
        clientSecret:'', //Add your spotify developer clientSecret
        refreshToken
    })
    spotifyapi.refreshAccessToken().then((data)=>{
        res.json({
            accessToken:data.body.access_token,
            expiresIn:data.body.expires_in,
        })
        
    })
    .catch(err=>
        {
            console.error("Error",err)
        })
})

app.listen(5000,()=>{
    console.log("Server is Running on Port 5000")
})