// import dataS3 from "data-s3";

const dev = process.env.NODE_ENV == "development";
// const bucket = "pudding.cool";
// const region = "us-east-1";
// const path = "path/to/folder";

const init = async () => {
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