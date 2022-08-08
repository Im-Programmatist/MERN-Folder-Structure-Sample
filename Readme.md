# Complete Folder Structure and Organize a MERN Application

Generaly when we start working on full stack project with `Node.js`,`Mongo DB` and `React.Js` technology. We make different folder structure or server resources for server and client. There would be separate directory or project repositories we used. This will be preferable for teams those working on separate technology.

`But`, In order to reduce cost of the different server and resources, complication to maintain different repositories on git, the project is in small scale and if you are beginner and wanted to learn all the aspects in MERN project and desire to keep track of all your practice work in one directory or repository (so that you can recall itin future) then I have good solution for folder struture. as follows -

We can divide folder structure in 3 parts -

### `Backend`
### `Frontend`
### `Global`

## `Backend`
1. This is the server part of the application and we will create all the stuff related to server in this directory.
2. We will have to make separate node_module folder for backend using initiating the node package. So, using this special package.json we can install all the packages which is only required for server related developement. 
3. We can add Mocha/Tea testing framework that is used to perform tests within our application.It makes sure everything works correctly. 
4. Commands to create Node.js project in Backend folder.
#### `$ npm init` OR `$ npm init -y`
- initiate node in folder and this will create package.json and  package.lock
#### `$ npm install --save-dev babel-cli` 
- Babel is mainly used to compile JavaScript code, which will have backward compatibility.
#### `$ npm i body-parser` 
- Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
#### `$ npm i mongodb` 
- install mongodb package in folder - we will gonna use mongoose for connection between node and mongodb database  
#### `$ npm i mongoose` 
- Object Data Modeling (ODM) library for MongoDB and Node. Mongoose provides a straight-forward, schema-based solution to model your application data.
#### `$ npm i nodemon` 
- Simple monitoring tool, tool that helps develop node. js based applications by automatically restarting the node application when file changes in the directory are detected. 
#### `$ npm i validator`  
- Vaidator is very popular pacge that used to make validation in a easy way for any form. 
#### `$ npm install mocha chai --save-dev`
- Mocha is a relatively fast and straightforward JavaScript test framework hosted on GitHub.
#### `$ npm i hbs`
- Using hbs as the default view engine requires just one line of code in your app setup. This will render .hbs files when res.render is called.
#### We will keep on adding packages as per our need

5. Folder Structure as below -
### node_module - created by default using npm init
### src- Source where all working folder place, this directory contains following folders ⬇️

**1. Configs - all database and other configuration detail files here**

**2. Controllers - All the business logic files can create in this controller folder**

**3. Middlewares - Pre or Post operation can perform respectively on request and response using middleware for all kind of routes**

**4. Models - Database schema models come under this folder**

**5. Routes - Route for all kind of  API**

**6. Services - Services for API, all routes method and their query operation files keep in this folder**

**7. Utils - Helper functions or global used files can keep in this folder**

### test - testing framework directory
### views - contains render hbs files if you want to run UI/presentation part using pure node js.
### public - contains images,css files and storage folder like for download(report csv file we need to create it and pass path in api response), 
### index.js - start point of the server application, here we mention express app and routes
### package.json & package-lock.json - package manager create this file, keep record of all the packages used in node project

**Note: For complete MERN project setup please follow the link -** https://www.querythreads.com/how-to-organise-file-structure-of-backend-and-frontend-in-mern/

**Note: For middleware refere link -** https://mongoosejs.com/docs/middleware.html#pre

**Note: For virtual in mongoose refere link -** https://mongoosejs.com/docs/tutorials/virtuals.html

## `Frontend`

**1. Create React app inside `Frontend` directory.** OR

**2. We can initiate npm int this folder and install node package `$ npm i react --save-dev`
    and `$ npm i react-dom --save-dev` and then required packages.**

**3. `Assets Folder` - As the name says, it contains assets of our project. It consists of images and styling files, etc. 

**4. `Layouts Folder` - It contains layouts available to the whole project like header, footer, etc. We can store the header, footer, or sidebar code here and call it.

**5. `Components Folder` - Components are the building blocks of any react project. This folder consists of a collection of UI components like buttons, modals, inputs, loader, etc., 

**6. `Pages Folder` - Indicate the route of the react application, A page can contain its subfolder. 

**7. `Middleware Folder` - This folder consists of middleware that allows for side effects in the application. It is used when we are using redux with react. Here we keep all our custom middleware.

**8. `Routes Folder` - This folder consists of all routes of the application. It consists of private, protected, and all types of routes.

**9. `Config Folder` - This folder consists of a configuration file where we store environment variables in config.

**10. `Services Folder` - This folder will be added api urls for each pages/routes in project.JavaScript modules here.

**11. `Utils Folder` - Utils folder consists of some repeatedly used functions that are commonly used in the project. Utilities, helpers, constants, and the like.

**12. `Store` - Global Redux store

**13. `.env` - place at root directory of frontend.


## `Global`

**1. Initiate `Git` and create `gitignore file` in root directory so that we can push our frontend and backend code in one respository**

**2. Initiate node in root directory using `$ npm init`, this will create package.json for `global` root directory. In global directory we will going to install 2 packages - concurrently and nodemon**

### 1. `$ npm i concurrently --save-dev`
- Concurrently is an npm package that allows you to run multiple commands concurrently.

### 2. `$ npm i nodemon` 
- Simple monitoring tool, tool that helps develop node. 

**3. Change start and dev path under script in package.json in `Backend`folder, make it  `"test": "mocha", "start": "node index.js", "dev": "nodemon index.js -e js,hbs"`** herer we have define to track changes in js as well as hbs files.

**4. Change dev path under script item in package.json of root directory, make it  `"dev": "concurrently \"cd Backend && npm run dev\" \"cd Frontend && npm start\" "`**


**5. We can run separate project, inside the server `Backend directory` if you run  `$ npm run dev` then only server express app will run**

**6. We can run separate project, inside the server `Frontend directory` if you run  `$ npm start` then only client react app will run**

**7. We can run separate project, inside the server `Root directory` if you run  `$ npm run dev` then both client react app and server express app will run in this one command**

**8. Just keep in mind both app must have different port to start.**

