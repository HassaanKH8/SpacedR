const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: process.env.API_KEY , domain: process.env.DOMAIN});

require("dotenv").config();

app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static('public')); 


mongoose.connect(process.env.MONGO_LINK);
const spacedSchema = {
    subject: String,
    work: String,
    date: String,
    num: String
}

const Task = mongoose.model("Task", spacedSchema);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname+"/index.html")); 
    
});

app.get("/info", function (req, res) {
    res.sendFile(path.join(__dirname+"/works.html")); 
    
});

let dt = new Date();
let date = ("0" + dt.getDate()).slice(-2);
let month = ("0" + (dt.getMonth() + 1)).slice(-2);
let year = dt.getFullYear();


app.post("/", function (req, res) {
    numbras = req.body.numbr;
    let newTask = new Task({
        subject: req.body.subject,
        work: req.body.work,
        date: date +"/"+ month+"/" + year,
        num:  req.body.email.replace(/\s+/g, '')
    });
    newTask.save();
    res.sendFile(__dirname+'/success.html');
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Got it Back");
    
   
    Task.find().then(function (result) {
        let sub = [];
        let wor = [];
        let dat = [];
        let subn = [];
        let worn = [];
        let numo = [];
        let numno = [];
        let datn = [];
        
        let y = [];
        let remy = [];
        let mytasks = [];
        let myremtasks = [];
        let totaltasks=[];



        function getLastWeek() {
            var today = new Date();
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3);
            return lastWeek;
        }
        
        var lastWeek = getLastWeek();
        var lastWeekMonth = lastWeek.getMonth() + 1;
        var lastWeekDay = lastWeek.getDate();
        var lastWeekYear = lastWeek.getFullYear();

        var today2 = new Date();

        var lastWeek2 = new Date(today2.getFullYear(), today2.getMonth(), today2.getDate() - 5);

        var lastWeekMonth2 = lastWeek2.getMonth() + 1;
        var lastWeekDay2 = lastWeek2.getDate();
        var lastWeekYear2 = lastWeek2.getFullYear();
        
        var lastWeekDisplayPadded = ("00" + lastWeekDay.toString()).slice(-2) + "/" + ("00" + lastWeekMonth.toString()).slice(-2) + "/" + ("0000" + lastWeekYear.toString()).slice(-4);
        var lastWeekDisplayPadded2 = ("00" + lastWeekDay2.toString()).slice(-2) + "/" + ("00" + lastWeekMonth2.toString()).slice(-2) + "/" + ("0000" + lastWeekYear2.toString()).slice(-4);



        for(i=0;i<result.length;i++){
            if(result[i].date==("0" + (new Date().getDate()-1)).slice(-2)+"/"+ month+"/" + year | result[i].date == lastWeekDisplayPadded | result[i].date == lastWeekDisplayPadded2){
                sub.push(result[i].subject);
                wor.push(result[i].work);
                dat.push(result[i].date);
                numo.push(result[i].num);
            }
            else{
                subn.push(result[i].subject);
                worn.push(result[i].work);
                datn.push(result[i].date);
                numno.push(result[i].num);
            }
        }
        for(let i = 0;i<subn.length;i++){
            remy.push(subn[i]);
            remy.push(worn[i]);
            remy.push(datn[i]);
            remy.push(numno[i]);
        }
        for(let i = 0;i<sub.length;i++){
            y.push(sub[i]);
            y.push(wor[i]);
            y.push(dat[i]);
            y.push(numo[i]);
        }
        const chunkSize = 4;
        for (let i = 0; i < y.length; i += chunkSize) {
            const chunk = y.slice(i, i + chunkSize);
            let x = String(chunk[0])+" " + " - "+" "+String(chunk[1])+"\n";
            mytasks.push(x);
            const data = {
                from: 'SpacedR SpacedR@itshassaan.me',
                to: chunk[3],
                subject: 'SpacedR Task',
                text: String(x.toString().replace(/,/g,'')) 
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            }
        for (let i = 0; i < remy.length; i += chunkSize) {
            const chunk = remy.slice(i, i + chunkSize);
            let z = String(chunk[0])+" " + " - "+" "+String(chunk[1])+" " + " - "+" "+String(chunk[2])+" " + " - "+" "+String(chunk[3]);
            myremtasks.push(z);
        }
        totaltasks.push(mytasks);
        totaltasks.push(myremtasks);

        // loop to make my app running

        var i = 1;

        function myLoop() {
          setTimeout(function() {
            console.log(new Date().getSeconds());
            i++;
            if (i < 17280) {
            myLoop();      
            }               
          }, 5000)
        }
        
        myLoop();

    });
});
