# User Stories & Workflow

## User
* As a user, I want to create an account with username and password.
* As a user, I want to create a profile with my favorite albums and rank them 1-10.
* As a user, I want to be able to update my favorite albums in my profile.

* As a user, I want to find a match who has similar music tastes to mine.
* As a user, I want to see my score displayed on my matches to see how compatible we are.

* As a user, when I log into the app, I want to see all of my matches.
* As a user, I want to be able to delete matches after an extended period of time.

## Developer
* As a developer, I want to create an app where people can find matches based on their music tastes (favorite albums).
* As a developer, I want to create a user object with all necessary profile item, including name and favorite albums array.


* As a developer, I want to create a score for compatibility for users based on the genre, artists and album title of the albums in their array.
* As a developer, I want to create a matches property on the user object to store all the matches data, including match _id, score and ranking.

* As a developer, I want to show stats of the app and show what albums are most matched on, etc.



## Workflow

### Create An Account
* Enter username and password
* Check to see if it exists
* Prompt for new email or save user

### User Login:
* Retrieves User album and User matches
* Ability to add, remove, sort, update User albums

### Back-End Functionality
* Compare every user's 10 albums with every other user's albums
    1. Compare albums (3 pts)
    2. Compare artists (2 pts)
    3. Compare genres (1 pt)
    4. For matched albums (only) include ranking

* User Profile
    * Username
    * Password
    * Profile - favorite albums, favorite matches?
    * Find matches button - able to delete matches and go find new ones

* Match Objects
    * 2 User IDs
    * 2 User numbers (scores)
    * if both user numbers = 0, do not store the match

## App Notes
* Misc
    * User cannot search app database for any users, can only see their matches profiles


