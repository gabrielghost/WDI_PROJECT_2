"use strict";var App=App||{};console.log("working"),App.API="",App.clientId="oauthclient_00009GHhx8useUIPuaxl2X",App.clientSecret="MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg",App.redirect_uri="http%3A%2F%2Flocalhost%3A7000%2Fcallback",App.init=function(){App.apiUrl="http://localhost:3000/api",App.redirect_uri="http%3A%2F%2Flocalhost%3A7000%2Fcallback",App.monzoAuth(),$(".button-collapse").sideNav()},App.monzoAuth=function(){console.log("running"),$.get("http://localhost:3000/api/monzo-redirect").done(function(o){$(".monzo").html('<a class="btn btn-lg btn-primary HomeView__login-button___3I_YY" href="https://auth.getmondo.co.uk/?redirect_uri='+App.redirect_uri+"&client_id="+o.url+'&response_type=code" >Sign in with your Monzo account</a>')}),App.monzoCallback()},App.monzoCallback=function(o,t){console.log("monzoAuth running clientside"),$.get("http://localhost:7000/callback").done(function(o){console.log(o),t.redirect("/")})},$(App.init.bind(App));