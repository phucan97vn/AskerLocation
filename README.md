# Asker Location
  Using OpenCage Geocoder to get Asker Location(State/City) with lat,lng values.

# HOW TO SETUP ENVIRONMENT and RUN in your Computer

## INSTALL Meteorjs
https://www.meteor.com/install
or if you already have curl , run in Terminal: 
```
curl https://install.meteor.com/ | sh
```

## Register
  Signup an new OpenCage account on https://opencagedata.com/users/sign_up.

## Get API key
  After Creating a new account, go to https://opencagedata.com/dashboard to get API key. 
    Example: eee98d5e9c94cb589cccbf2****

## Clone the Repository 
  git clone git@github.com:phucanvn2012/AskerLocation.git
  
## Install Packages and Run
  
  cd AskerLocation
  meteor npm install  
  meteor
  
  
## Using the App


### Create account
 
 Signup the new account then it will automatically login to the system.
 If you somehow misclick the Logout button and being pushed back to the login page.
 You have to re-enter the credentials and use the Verification Code from the Terminal log to login back.

### Modify before use the App.

  You have to replace the API key in AskerLocation/imports/api/remote/asker-location-methods.js in order to use it.
  Line 23 and Line 88
  ```
  var apikey = '***************';
  ```
  Each API key can be used for 2500 times . 
  Currently the App is set to use the API for 2000 times . You can change the variable "limit:" to change the amount of records you want to get at Line 15
  ```
  const allAskerLocation = AskerLocation.find({city:{$exists:false}},{limit:2000}).fetch();
  ```
  
  
### Using the App. 
  
   Click the Asker Location button on the Navigation Bar on the top of the UI.
   Click the "Click Here to see" Button to get the Records. 
    - Wait until the data is shown on the console of the browser.
   Click the Send Request and Update.
   The system will run through all Records and update the AskLocation database.
   You could check the Amount of times you have left by Clicking the "Check Limitation" Button.
   It will run 1 specific API an return the JSON data. You can see your data in console and your remaining time is at  
      ```data.rate.remaining```
   
