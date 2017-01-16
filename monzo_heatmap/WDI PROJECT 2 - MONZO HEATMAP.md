**MONZO HEATMAP**

Users authenticate via Monzo api which provides users' activity data and then displays the information in the form of a heatmap on google maps.

Challenges

- user authentication using OAuth2.0

Step 1: Relocate the user to Monzo to authorise the account.

Step 2. Relocate user back to app with an authorization code

Step 3. That authorization code is then exchanged for an access token

Step 4. Access user information and then render it on map

- - - - - - 
Day 3 - Friday

Summary: I finally managed to get the required data sent back to me in an object. My main challenge was getting the code and token used in Monzo's OAuth system sent back to either Monzo's server or the client's using request promise in the correct way.

- - - - - - 

Day 4 - Saturday 

AIMS

Today I shall take that data and get it showing on the heatmap in the correct way.

The steps of that will be as follows: 

Initially for each transaction, generate a latlang and have that added to the required array in the google API.

Once that is working, breaking it down further so instead of every transaction, there is a marker for every pound spent.

Bonus:

From here, working on how to isolate spend in terms of genre would be interesting - able to 'solo' or 'mute' different parts.

CONCLUSION

I was able to add the correct data points to the array and have them displaying on the map. They were not hugely impressive - possibly because of the lack of data I have, or perhaps the settings I have not being quite correct.

Google maps has a weighting system built into the API which allows me to emphasise the amount of money spent at any one location. This wasn't working with as much sensitivity as I would have desired, and the time it took for the page to load while working the heatmap calculations was not satisfactory really.

- - - - - - 

Day 5 - Sunday

AIMS

- Tidy up the flow in general and work out the best way of managing server side and client side functions.

- I intend to polish the login part - functionally at least so that another person with a dev account may load up their information into the site - ready for the presentation on Wednesday. This shouldn't be too difficult and I'm almost there with it already.

- Have top 5 places, ordered by total spend

- Explore the possibility of multiple heatmaps for different genres

Conclusions @ 6pm. 

Today has been difficult. I have learnt that my system hasn't been created in the correct way and needs a rebuild.

A users clientID and clientSecret are needed to access the information. This is information that needs to be stored in the front end, unless we commit users' transaction details to the database which doesn't seem to be the correct approach.

- - - - - -

Day 6 - Monday

After a low point last night I have managed to work through the rebuild so that the heatmap generates - hopefully for any user, although that needs to be tested.

My aims for today now are to show a pop up for the locations with a little bit more information about the locations.

OR Top 5 locations by total spend?

I'm going to experiment with markers to see if I can get things looking a little better with them.





