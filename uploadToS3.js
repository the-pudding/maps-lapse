import dataS3 from "data-s3";
import fs from "fs";
import * as dotenv from "dotenv"
import AWS from 'aws-sdk'
import {groups} from "d3";


dotenv.config();


// import("dotenv/config");

// const dev = process.env.NODE_ENV == "development";
const bucket = "pudding.cool";
const region = "us-east-1";

//
let path = "projects/courts/webp";


let s3;

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

AWS.config.update({region:'us-east-1'});

function uploadImage(court,size,format){
    return new Promise(async(resolve, reject) => {

        path = "projects/courts/webp";
        let file = `${court.id}.${format}`
        let key = `${path}/${size}/${file}`

        if(format == 'jpg'){
            path = "projects/courts/jpg";
            key = `${path}/${file}`
        }

        // https://s3.amazonaws.com/pudding.cool/projects/courts/jpg/1092491013.jpg

        // console.log(court.id)

        let data;
        if(format == "jpg"){
            data = fs.readFileSync(`../../../Volumes/My Passport/tiles/${court.properties.geo}/google_way_${court.id}.${format}`);
        } else {
            data = fs.readFileSync(`../../../Volumes/My Passport/tiles_${size}/${court.properties.geo}/google_way_${court.id}.${format}`);
        }

        const uploadedImage = await s3.upload({
            Bucket: "pudding.cool",
            Key: key,
            Body: data,
        }).promise()
        
        console.log(uploadedImage.Location)
        resolve()
    })
}

export default async function uploadToS3(courts,size,format){
    console.log("hello")
    s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    })

    let ended = courts.map(d => +d.id).indexOf(1213888403);
    console.log(courts.length)

    let chunks = groups(courts.slice(0,courts.length), (d,i) => {
        return Math.floor(i/50);
    })

    console.log(format)

    for (let chunk of chunks){
        await Promise.all(chunk[1].map(async d => {
            await uploadImage(d,size,format);
        }));
        console.log("promise finished");
        console.log(chunk[0])
    }
}