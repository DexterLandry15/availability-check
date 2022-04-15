const { VK } = require('vk-io');
const { token } = require('./token.json');
const vk = new VK({
	token: token
});
const fs = require("fs");
const data = fs.readFileSync('./input.txt', {encoding:'utf8'});
let data_string = data.toString();
let arr = data_string.split('\r\n');

//console.log(arr)
let groups;
let users;
let free_g = [];
let free_u = [];

let done_arr = [];

async function check_available() {
	for (let i=0; i < arr.length; i++) { 
	try{ groups = await vk.api.groups.getById({group_id: arr[i].replace(/\s/g, '') });}catch(err){free_g.push(arr[i])};
	try{ users = await vk.api.users.get({user_ids: arr[i].replace(/\s/g, '') }); if (!users.length){free_u.push(arr[i])};}catch(err){};
	users = await vk.api.users.get({user_ids: arr[i].replace(/\s/g, '') });
	//console.log(users);
	}
};

async function output(){
	await check_available()
	//console.log(free_g);
	//console.log(free_u);
	let chars = [].concat(free_g, free_u)
	//console.log(chars)
	done_arr = chars.filter((free_g, free_u) => {
		return chars.indexOf(free_g) !== free_u;
	});
	//done_arr = mergeNoDuplicates(free_g, free_u);
	//console.log(done_arr);
	//console.log(done_arr)
	const writeStream = fs.createWriteStream('output.txt');
	const pathName = writeStream.path;
	done_arr.forEach(value => writeStream.write(`${value}\n`));
	writeStream.on('finish', () => {
	   console.log(`wrote all the array data to file ${pathName}`);
	});
	writeStream.on('error', (err) => {
		console.error(`There is an error writing the file ${pathName} => ${err}`)
	});
	writeStream.end();
};
output();

