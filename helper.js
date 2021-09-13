
const fetch = require('node-fetch');
const { resourceLimits } = require('worker_threads');
class Helper{

    constructor(){
        
    }

    errorCheckTags(tags){
        if (tags.length == 0){
            return false;
        }
        if (tags[0] == "\"" && tags[1] == "\"" ){
            return false;
        }
        return true;
    }
    errorCheckSortBy(req){
        if (req.query.sortBy != "id" && req.query.sortBy != "reads" && req.query.sortBy != "likes" && req.query.sortBy != "popularity" ){
            return false;
        }
        return true;
    }
    errorCheckDirection(req){
        if (req.query.direction != "asc" && req.query.direction != "desc"){
            return false;
        }
        return true;
    }
    async storeData(tags,req,object){
        const strings = tags.split(",");
        let promiseArray = []
        let result = {};
        result.posts = [];
        for(let i = 0;i < strings.length;i++){

            promiseArray.push( await fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${strings[i]}`));
            let response = await promiseArray[i].json();
            if (req.query.sortBy === "likes" || req.query.sortBy === "id" || req.query.sortBy === "reads" || req.query.sortBy === "popularity" ){

                for (let j = 0; j < response.posts.length;j++){
                    result.posts[object.counter] = response.posts[j];
                    object.counter ++;
                }

            }

        }
        
        let promise = await Promise.all(promiseArray);
        if(promise.length != 0){
            return result;
        }
        return null;

    }
    sortData(direction,result,sortBy){

        let sorted = null;

        if (sortBy === "likes"){
            if (direction === "asc"){
                result.posts.sort(function(a,b){
                    return a.likes - b.likes;
                });
            }
            else{
                
                result.posts.sort(function(a,b){
                    return b.likes - a.likes;
                });
                
            }
        }
        else if(sortBy === "id"){
            if (direction === "asc"){
                result.posts.sort(function(a,b){
                    return a.id - b.id;
                });
            }
            else{
                
                result.posts.sort(function(a,b){
                    return b.id - a.id;
                });
                
            }
        }
        else if (sortBy === "reads"){
            if (direction === "asc"){
                result.posts.sort(function(a,b){
                    return a.reads - b.reads;
                });
            }
            else{
                
                result.posts.sort(function(a,b){
                    return b.reads - a.reads;
                });
                
            }
        }
        else{
            if (direction === "asc"){
                 result.posts.sort(function(a,b){
                    return a.popularity - b.popularity;
                });
            }
            else{
                
                result.posts.sort(function(a,b){
                    return b.popularity - a.popularity;
                });
                
            }
        }
     


    }
    removeDuplicates(result){


        let array = [];
        let i = 0;
        for( i = 0; i < result.posts.length-1;i++){

            if (result.posts[i].id === result.posts[i+1].id){
                array.push(result.posts[i]);
                i ++;
                
            }
            else{
                array.push(result.posts[i]);
            }
        } 
        array.push(result.posts[i]);
        return array;


    }
}
module.exports = Helper;