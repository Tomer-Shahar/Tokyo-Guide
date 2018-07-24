# README #

This is a website we wrote for assisting people in plannning their trip to tokyo. The client side was developed in AngularJS and the server side was developed in node.js

# Main home window

Whilst entering the website, the user will be confronted with the following screen:

![Home-Page](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/homepage.PNG?raw=true)

You can easily see that you aren’t currently logged in, since the top pane reads “Hello, Guest” and there is also a sign-in option. In addition, in the top-right corner of the screen there is a “Sign Up” link. There is an additional link for signing up in the bottom right portion of the screen (underneath the famous The Great Wave Off Kanagawa painting). 
By scrolling down the user will find 3 random points of interest to view. Clicking each of them will open a modal showing more information.

# Registering

After clicking the “Sign Up” link, the user will be taken to this screen
![registering](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/Registering.png?raw=true)
After filling in all the fields, the user may click the “Submit” button at the bottom. If there are issues with signing up, the appropriate messages will appear at the bottom. If there aren’t any issues, you will be transferred back to the home screen where you may now sign in with your new account.

# Logging in
By clicking the “Sign In” option at the top of the screen, the user will be transferred to this page:
![Logging in](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/loggingin.png?raw=true)
Here you can sign in or restore your password in case you forgot it by clicking “Forgot Password?”.

# About Screen
Clicking the “About” link will load the following page:
![About](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/about.png?raw=true)
Here you can read a bit about Tokyo and see some cards with random attractions.

# Attractions Page
Clicking the “Attractions” link will load the following screen:
![Attractions](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/attractions.png?raw=true)
Here you can view all of the attractions that are shown on the website. You may also sort and/or filter them. Clicking one of them will bring up a screen like so:
![Attractions](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/attractions2.png?raw=true)

# Logged in users
Once logging in, you will be transferred back to the home page and your user name will appear at the top of the screen like so:
![users](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/users.png?raw=true)
In addition, the “Sign up” and “Sign in” buttons are gone. Instead, a new “Favorites” icon appeared in their place and a link to the administrator screen. At the bottom of the screen you may view personal recommendations and your latest saved attractions. 

# Favorites Screen
Clicking on the favorites icon 
![icon](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/icon.png?raw=true)
will load the following screen:
![favorites](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/favorites.png?raw=true)

Here the user can see their favorite attractions. The user can search, filter and sort the attractions and save for later use. In order to properly save the attractions, click the “Save Changes” button. If the save was successful, the icon will change as so:

![successful](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/successful.png?raw=true)

Note: it is necessary to save the changes in order to update the server of your new preferences.

# New options for logged in users
Once logged in, the user can add favorite attractions to their list and also submit reviews. This can be done in several ways. For example from the attractions page:

![reviews](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/reviews.png?raw=true)

Favorite attractions are marked with a full heart, while non-favorites have an empty heart.
This may also be accomplished by clicking one of the attraction links in any part of the page:

![heart](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/heart.png?raw=true)

Clicking the “Write a review” button will make it open as so:

![Write](https://github.com/Tomer-Shahar/Tokyo-Guide/blob/master/client/resources/images/write.png?raw=true)

At this point a user can rate the attraction on a scale of 1-5, and can optionally write a review. If all is well the user can submit the review and it’ll add it to the database. Note that you can only review an attraction once. If the review was successful, an appropriate message will appear.
