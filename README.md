to do:

why isn't the clean file working on all jsons?

# lambda node template

## setup
* create new repo with the `Use this template` button
* use npm to install dependencies

## local development
* run `npm start` 

## deploy

## build
- run `make upload`

## AWS integration
- in AWS, go to the Lambda service
- click `Create function` button
	- Function name: (mimic repo name)
	- Runtime: `Node.js 16.x`
	- Architecture: `x86_64`
	- Permissions -> Change dfefault execution role:
	- Select `Use an exisiting role` then `lambda-node` from dropdown

### Code tab
- In Code Source, click `Upload from` button
	- upload .zip file (`upload.zip` in repo)

### Configuration tab 
#### General configuration
- Click `Edit`
	- Memory: `1024` or more for large data processing
	- Timeout: `1 min` or `10 min` for long running tasks
#### Environmental variables
- Fill in as needed

### Test tab
- Event name: `test`
- Event JSON: `{}`
- Click `Save`

You can run the code by clicking `Test` whenever to manually execute the script. Make sure this is succesful before moving on.

### Cron job
- Click `+Add trigger` button at top in `Function overview` section
- Select `Eventbridge (cloudwatch events)`
- Select `Create a new rule`
	- Rule name: `cloudwatch-` + lambda function name
	- Rule type: `Schedule expression`
		- example: every 10 minutes `rate(10 minutes)` or `cron(0/10 * * * ? *)`
		- [https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-expressions.html](docs)
