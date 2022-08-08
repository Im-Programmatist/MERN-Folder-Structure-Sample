//Must keep env configuration at top
import dotenv from 'dotenv';
dotenv.config({path: './src/configs/.env'});

import express from 'express';
import path  from 'path';
import bodyParser from 'body-parser';
import registrationRouter from './src/routes/registration.route.js';
import loginRouter from './src/routes/login.route.js';
import usersRouter from './src/routes/users.router.js';
import contactusRouter from './src/routes/contactus.route.js';
import { establishConn } from './src/services/connection.service.js';
import { connection_config } from './src/configs/mongodb.config.js';
import  { requestTime }  from "./src/middlewares/reqTime.middleware.js";
//JWT Authentication
import  { jwtTokenGenerate, jwtAuthVerify }  from "./src/middlewares/authentication.middleware.js";
import cookiesPaser from "cookie-parser";
//Error handler middleware
import errorhandler from "errorhandler";
//import  { errorHandler }  from "./src/middlewares/errorHandler.middleware.js";

//view engine in node project 
import hbs from "hbs";
//to defined __dirname in ES module scope
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const { app: { port } } = connection_config;
const port_default = process.env.PORT || port;
//Establish connection 
establishConn();
//console.log(process.env.JWT_SECRETE_KEY) 
//console.log(process.env.PORT) // remove this after you've confirmed it working

//We do not need this express.json() parser for GET AND DELETE request,
//we need to use it to get data from POST/PUt request to get in json format
//THis is call middleware in express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//OR use below bodyparser package methods
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
//app.use(bodyParser.json())
app.use(cookiesPaser());

/****************************START NODE JS WEBSITE************************************************/

//We want to run website on pure Node Js for this we have to use hbs template engine and static paths
const static_path = path.join(__dirname, "/public");  //find index.html inside public if not found then run template/index.hbs
const template_path = path.join(__dirname, "views/templates");
const partial_path = path.join(__dirname, "views/partials");  
//If we are using HTML in public folder then set view engine html else hbs
app.use("/public", express.static(static_path));
/*using new template engine hbs*/
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partial_path);

//Middlewares
/*Use global middle ware here*/
app.use(requestTime);
/* Error handler middleware */
//app.use(errorHandler);//localcreated middleware
if (process.env.NODE_ENV === 'development') {
	// only use in development
	app.use(errorhandler({ log: errorNotification }))
}
function errorNotification (err, str, req) {
	var title = 'Error in ' + req.method + ' ' + req.url;
	notifier.notify({
		title: title,
		message: str
	})
}

//VIew Routes
app.get('/', (req, res) => {
	if(req.cookies.fullName !== undefined)
		res.render("index",{flashMessage:{"message":`Welcome ${req.cookies.fullName}`,isFlash:true,isName : req.cookies.jwt ? true : false,name: req.cookies.fullName}});
	else
		res.render("index");
	//res.send(req.flash('message'));
});

app.use('/login', loginRouter, jwtAuthVerify);

app.use('/register', registrationRouter);

app.get('/about', (req, res) => {
	res.render("about",{flashMessage:{isFlash:false}});
});
//app.use(jwtAuthVerify);
app.get('/experience', jwtAuthVerify, (req, res) => {
	res.render("experience",{flashMessage:{isFlash:false}});
});

app.use('/contact', contactusRouter, jwtAuthVerify); 

app.get('/logout', jwtAuthVerify, async (req, res) => {
	
	req.user.tokens = req.user.tokens.filter((currentElement, index, array)=>{
		return currentElement.token !== req.token;
	});//Remove only the token which is use on this device in array from document of collection in mongodb
	req.user.tokens = [];//Remove all token in array from document of collection in mongodb
	res.clearCookie('jwt');//Remove from cookies
	res.clearCookie('fullName');//Remove from cookies
	//res.cookie('jwt', {maxAge: 0});
	//res.cookie('fullName', {maxAge: 0});
	res.clearCookie();
	console.log("Logout successfully!");
	await req.user.save();//we want to save data after logout
	res.redirect("/login");
});

/****************************END NODE JS WEBSITE************************************************/

//Run app at port localhost on server  
app.listen(port_default, '0.0.0.0', () => {
	console.log(`Backend app listening at http://localhost:${port_default}`)
});
