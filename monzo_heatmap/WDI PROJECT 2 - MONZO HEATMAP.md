**MONZO HEATMAP**

Users authenticate via Monzo api which provides users' activity data and then displays the information in the form of a heatmap on google maps.

Challenges

- user authentication using OAuth2.0

Step 1: Relocate the user to Monzo to authorise the account.

Step 2. Relocate user back to app with an authorization code

Step 3. That authorization code is then exchanged for an access token

Step 4. Access user information and then render it on map

