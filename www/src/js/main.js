var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        OnayApp.init()
   //      $('.js-get-camera-image').click(function(event) {
   //      	navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
			//     destinationType: Camera.DestinationType.FILE_URI });

			// function onSuccess(imageURI) {
			//     var image = document.getElementById('myImage');
			//     image.src = imageURI;
			// }

			// function onFail(message) {
			//     alert('Failed because: ' + message);
			// }
   //      });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

app.initialize();
