const express = require('express');
const fetch = require('node-fetch');
const { resourceLimits } = require('worker_threads');
const Helper = require('./helper.js');
const app = express();

app.get('/api/ping', (req,res) => {
    res.status(200).json({success:true});
});
app.get('/api/posts', async (req,res) => {
    try{
       
        let helperMethods = new Helper();
        let helperCounter = {counter: 0};
        let result = {};
        result.posts= [];
        const tags = req.query.tags;
        if (JSON.stringify(req.query) === '{}'){
            res.status(400).json({error : "Tags parameter is required"});
        }
        
        if(!helperMethods.errorCheckTags(tags)){
            res.status(400).json({error : "Tags parameter is required"});
        }
        if(!helperMethods.errorCheckSortBy(req)){
            res.status(400).json({error: "sortBy parameter is invalid"});
        }
       
        if (!helperMethods.errorCheckDirection(req)){
            res.status(400).json({error:"direction parameter is invalid"});
        }
        
        if("sortBy" in req.query == false){
            req.query.sortBy = "id"
        }
        if ("direction" in req.query == false){
            req.query.direction = "asc"
        } 
        result = await helperMethods.storeData(tags,req,helperCounter);
        if(result){
            helperMethods.sortData(req.query.direction,result,req.query.sortBy);
            result.posts = helperMethods.removeDuplicates(result); 
        }
        
        res.status(200).json(result);
    } catch(err){
        res.send(err)
    }
});
let server = app.listen(3000, () => {

    console.log("Listening on port 3000.....");
    
});

module.exports = server;