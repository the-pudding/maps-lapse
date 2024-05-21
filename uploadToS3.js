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
const path = "projects/courts/jpg";
let s3;

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

AWS.config.update({region:'us-east-1'});

function uploadImage(court){
    return new Promise(async(resolve, reject) => {
        // console.log(court.id)
        // let file = `${court.id}.png`
        // let data = fs.readFileSync(`../../../Volumes/My Passport/raw_images/${court.properties.geo}/google_way_${court.id}.png`)
        
        let file = `${court.id}.jpg`
        let data = fs.readFileSync(`../../../Volumes/My Passport/tiles/${court.properties.geo}/google_way_${court.id}.jpg`)

        const uploadedImage = await s3.upload({
            Bucket: "pudding.cool",
            Key: `${path}/${file}`,
            Body: data,
        }).promise()
        
        console.log(uploadedImage.Location)
        resolve()
    })
}

export default async function uploadToS3(courts){

    s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    })

    let ended = courts.map(d => +d.id).indexOf(1213888403);
    console.log(courts.length)

    let chunks = groups(courts.slice(0,courts.length), (d,i) => {
        return Math.floor(i/50);
    })

    for (let chunk of chunks){
        await Promise.all(chunk[1].map(async d => {
            await uploadImage(d);
        }));
        console.log("promise finished");
        console.log(chunk[0])
    }
}