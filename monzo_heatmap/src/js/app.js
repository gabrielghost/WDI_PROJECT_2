console.log('working');

$(init);

const API = 'http://localhost:4000';

function init() {
  $('button').on('click', monzoAuth);
}

function monzoAuth(){
  $.get('https://auth.getmondo.co.uk/?redirect_uri=https%3A%2F%2Flocalhost%3A7000%2Fcallback&client_id=oauthclient_00009GHhx8useUIPuaxl2X&response_type=code').done(data => {
    console.log('working');
    console.log(data);
  });
}
