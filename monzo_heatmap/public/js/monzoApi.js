"use strict";var App=App||{};console.log("working"),App.API="",App.clientId="oauthclient_00009GHhx8useUIPuaxl2X",App.clientSecret="MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg",App.redirect_uri="http%3A%2F%2Flocalhost%3A7000%2Fcallback",App.init=function(){App.apiUrl="http://localhost:3000/api",App.redirect_uri="http%3A%2F%2Flocalhost%3A7000%2Fcallback",App.monzoAuth()},App.monzoAuth=function(){console.log("running"),$.get("http://localhost:3000/api/monzo-redirect").done(function(t){$(".monzo").html('<a target="_blank" href="https://auth.getmondo.co.uk/?redirect_uri='+App.redirect_uri+"&client_id="+t.url+'&response_type=code">login to monzo</a>')})},$(App.init.bind(App));