"use strict";function init(){App.apiUrl="http://localhost:3000/api",App.redirect_uri="http%3A%2F%2Flocalhost%3A7000%2Fcallback",App.monzoAuth()}console.log("working");var App=App||{};$(init),App.monzoAuth=function(){console.log("running"),$.get("http://localhost:3000/api/monzo-redirect").done(function(o){$(".monzo").html('<a href="https://auth.getmondo.co.uk/?redirect_uri='+App.redirect_uri+"&client_id="+o.url+'&response_type=code">login to monzo</a>')})};