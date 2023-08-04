// import dataS3 from "data-s3";
import * as d3 from "d3";
import fetch from "node-fetch";
import fs from "fs";

import mbxClient from '@mapbox/mapbox-sdk'
import mbxStyles from '@mapbox/mapbox-sdk/services/styles.js'
import mbxTilesets from '@mapbox/mapbox-sdk/services/tilesets.js'
import mbxStatic from '@mapbox/mapbox-sdk/services/static.js'






const dev = process.env.NODE_ENV == "development";
// const bucket = "pudding.cool";
// const region = "us-east-1";
// const path = "path/to/folder";

const init = async () => {


	const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2xqc2g3N2o5MHAyMDNjdGhzM2V2cmR3NiJ9.3x1ManoY4deDkAGBuUMnSw' });
	const stylesService = mbxStyles(baseClient);
	const tilesetsService = mbxTilesets(baseClient);
	const staticClient = mbxStatic(baseClient);

	function getImage(coors,name){
		staticClient.getStaticImage({
			ownerId: 'mapbox',
			styleId: 'satellite-v9',
			width: 1280,
			highRes: true,
			height: 1280,
			position: {
			  zoom:18,
			  coordinates:coors
			}, 
		  })
			.send()
			.then(response => {
			  const image = response.body;
				fs.writeFile(`${name}.jpeg`, image, 'binary', function(err){
					if (err) throw err
					console.log('File saved.')
				})
	
			});
	}


	let rawdata = fs.readFileSync('export.json');	
	let rawdataParsed = JSON.parse(rawdata);
	let courts = rawdataParsed.features;

	for (let court in courts.slice(0,50)) {
		let coors = courts[court].geometry.coordinates;
		console.log(coors[0][0])
		getImage(coors[0][0],court)
		// let url = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coors[0]},${coors[1]},18,0/1280x1280@2x?access_token=pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2xqc2g3N2o5MHAyMDNjdGhzM2V2cmR3NiJ9.3x1ManoY4deDkAGBuUMnSw`
		// console.log(url)
		// const response = await fetch(url);
		// console.log(response)
        // fs.writeFile(`${court}.jpeg`, response, 'binary', function(err){
        //     if (err) throw err
        //     console.log('File saved.')
        // })
	}
	
	// const accessKeyId = process.env.S3_ACCESS_KEY_ID;
	// const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

	// dataS3.init({ accessKeyId, secretAccessKey, region });
};

export const handler = async () => {
	await init();
};

if (dev) {
	await import("dotenv/config");
	await init();
}