# Welcome to My Health Helper repository! 

## Introduction

**Please read this document before running the project**

To run the project, you will need to have to have the following installed and running on your computer: 

* MongoDB

* NodeJS

* Google Chrome

If you do not have these running on your computer, this document will go over the setup and installation process for these programs. Please note, this app is designed to be hosted from a computer running Windows 10.
## Installing required programs
The following sections tell you how to install the software necessary programs and services to run the project. If you already have the programs installed, you can skip over this sections. 
### To setup Node JS
If running this project on a Sheffield Hallam Computer, NodeJS can be found in and launched from AppsAnywhere. Once launched from AppsAnywhere, Node JS should be running in Cloudpaging Player and you can the Node JS setup is complete.

If you are not running this project on a Sheffield Hallam computer, please open this link and follow its instructions to install Node JS on your machine. [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

### To setup Mongo DB
To run Mongo DB on a Sheffield Hallam computer, go this link:[https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community) Select your Operating System and select ZIP as the package and download the file to your desktop.

Once downloaded, unzip the file on your desktop. Open the folder, you should see a bin folder and other files inside it. Take note of the location of the bin folder. Create a new folder inside it create a folder called "data". Inside that folder, create folder called "db".

Open command prompt and run the following command to start running mongo DB "[file path to bin folder]\mongod.exe --dbpath [file path to db folder you created]".

Once you have executed this command, Mongo DB should now be running on your computer.

If you are not running this project on a Sheffield Hallam computer, you can choose to install the MSI package instead of the ZIP, and run the MSI installer to install Mongo DB on your computer have it run as service on your computer. Once you download the MSI package, all you need to do is run it and follow it's installation wizard.

#### Mongo DB Compass (Optional)
Mongo DB Compass is a GUI interface that can be installed to view the database objects stored in Mongo DB. It is not needed to run the project, but can be useful for seeing what is happening inside the database.

If running the project on a Sheffield Hallam computer, Mongo DB can be found and run from AppsAnywere. If you are not running the project on a Sheffield Hallam computer, you can download and install Mongo DB Compass from the following link: [https://www.mongodb.com/download-center/compass](https://www.mongodb.com/download-center/compass). You will need to select you Operating System as the platform before downloading it.

Once launched/install, open the program. To view the files of your running Mongo DB database, you will need to the database by connecting to local host in Mongo DB Compass. If you have no connection strings in the text box, clicking connect will automatically connect you to the local host database.

### To set up Google Chrome
If you are running the project on a Sheffield Hallam computer, Google Chrome should already be installed on your computer. If not, you can install Google Chrome to your computer using the following link: [https://www.google.com/chrome/](https://www.google.com/chrome/)

## Running the project
To run the project, you will need to run both the server and client on your machine, running two terminals/command prompts at the same time.
### Running the back end server
To run the back end server, you will need to open the healthwebserver folder. Once in the folder, replace the file patch in the address bar with "cmd" and hit enter. This will open the folder in the command prompt.

You will then need to type npm i and hit enter to install the required Node JS packages to run the server.

Once npm i has finished installing the packages, type npm start and hit enter to start the server.

### Running the front end client

To run the front end client, you will need to open the healthwebapp folder. Once in the folder, replace the file patch in the address bar with "cmd" and hit enter. This will open the folder in the command prompt.

You will then need to type npm i and hit enter to install the required Node JS packages to run the client.

Once npm i has finished installing the packages, type npm start and hit enter to start the client. Once running, the client web page may open up in your default web browser. If the web page opened in Chrome, you do not need to do anything else. If the web page opened in another browser or didn't open, open Google Chrome and type "localhost:3000" into the address bar and hit enter to go to the website.
