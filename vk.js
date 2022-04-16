const { VK } = require("vk-io");
const { token } = require("./token.json");
const vk = new VK({
  token: token,
});
const fs = require("fs");
const data = fs.readFileSync("./input.txt", { encoding: "utf8" });
let data_string = data.toString().toLowerCase();
let arr = data_string.split("\r\n");

console.log(arr);
let groups;
let users;
let gArr = [];
let uArr = [];

let done_arr = [];

async function check_available() {
  for (let i = 0; i < arr.length; i++) {
    try {
      groups = await vk.api.groups.getById({
        group_id: arr[i].replace(/\s/g, ""),
      });

	  if (!!groups) {
		gArr.push(arr[i]);
	  };
    } catch (err) {
	  console.log([i] +" group " + !!groups);
      
	  //console.log(groups)

    };


    try {
      users = await vk.api.users.get({ user_ids: arr[i].replace(/\s/g, "") });
      if (!!users.length) {
        uArr.push(arr[i]);

      }
      console.log([i] +" user " + !!users.length);
     // console.log(users);
    } catch (err) {}
    //users = await vk.api.users.get({user_ids: arr[i].replace(/\s/g, '') });
    //console.log(users);
  }
}

async function sortingArr() {
  await check_available();
  console.log(gArr);
  console.log(uArr);
  combArr = [].concat(gArr, uArr);
  //console.log(chars)
  /*
  done_arr = chars.filter((free_g, free_u) => {
    return chars.indexOf(free_g) == free_u;
  });
  */
  //done_arr = mergeNoDuplicates(free_g, free_u);
  //console.log(done_arr);
  console.log(combArr)
  for (let i = 0; i<arr.length; i++) {
	  for(let j = 0; j<combArr.length; j++) {
		  if (arr[i] === combArr[j]) {  console.log(arr[i] + ' del'); delete arr[i];}
	  }
  }
  console.log(arr)
}

async function output() {
  await sortingArr();
  console.log("Sorting complete!");
  
  const writeStream = fs.createWriteStream("output.txt");
  const pathName = writeStream.path;
  arr.forEach((value) => writeStream.write(`${value}\n`));
  writeStream.on("finish", () => {
    console.log(`wrote all the array data to file ${pathName}`);
  });
  writeStream.on("error", (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`);
  });
  writeStream.end();
  
}
output();
