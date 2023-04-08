const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const { tallySchema } = require("./schema");
const port = 8080


app.use(express.urlencoded({extended:false}));
app.use(express.json())

const { connection } = require('./connector')

app.listen(port, ()=> {
    console.log(`App listening at port ${port}!`)
})

app.get("/totalRecovered", async (req,res)=>{

    try {
        const data = await connection.find();
        let total = 0;
        for (i = 0; i < data.length; i++) {
            total += data[i].recovered
        }
        res.status(200).json({
            data: { _id: "total", recovered: total },

        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})

app.get('/totalactive', async (req,res)=> {

    try {
        const data = await connection.find();
        let total = 0;
        for (i = 0; i < data.length; i++) {
            total += data[i].infected
        }
        res.status(200).json({
            data: { _id: "total", active: total },

        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})

app.get('/totalDeath', async (req,res)=>{

    try {
        const data = await connection.find();
        let total = 0;
        for (i = 0; i < data.length; i++) {
            total += data[i].death
        }
        res.status(200).json({
            data: { _id: "total", death: total },

        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }


})

app.get('/hotspotStates', async (req, res)=>{

    try {
        const covidData = await connection.find();
        let recovered = 0;
        let infected = 0;
        const data = []
        for (i = 0; i < covidData.length; i++) {
            recovered = covidData[i].recovered
            infected = covidData[i].infected
            rateValue = ((infected - recovered) / infected)

            if (rateValue > (0.1)) {
                rateValue = rateValue.toFixed(5);
        
                data.push({ state: covidData[i].state, rate: rateValue });
            }
        }

        res.status(200).json({
            data

        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})

app.get('/healthyStates',async(req, res)=>{
    
    try {
        const data = await connection.find();
        let states=[];
        for (i = 0; i < data.length; i++) {
            let mortality = (data[i].death)/(data[i].infected)
            
            if(mortality < 0.005) {
               states.push({state:data[i].state,mortality:mortality})
            }
        }
        res.status(200).json({
            data: states,

        })
    } catch (error) {
        res.status(500).json({
            sta: "failed",
            message: error.message
        })
    }

})


module.exports = app;