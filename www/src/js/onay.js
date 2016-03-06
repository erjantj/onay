var OnayApp = {
	$addTicketButton: $('.js-add-ticket-button'),
	$addTicketFile: $('.js-add-ticket-file'),
	$ticketNumber: $('.js-ticket-number'),
	$displayImage: document.createElement("img"),
	$loadingIcon: $('.js-loading-icon'),
	$infoText: $('.js-info-text'),
	$getTicketBalanceButton: $('.js-get-ticket-balance'),
	$ticketBalance: $('.js-ticket-balance'),

	ticketNumberVisibleClass: 'content__info__ticket-number--visible',
	loadingIconVisibleClass: 'content__loading--visible',
	getTicketBalanceButtonVisibleClass: 'content__add-ticket__balance--visible',
	ticketBalanceVisibleClass: 'content__info__ticket-balance--visible',

	requestUrl: 'http://onay.erjantj.com/getbalance.php',
	errorMessage: 'Мы не смогли узнать билет :( <br /> Попробуйте еще раз"',

	// $canvas: $('.js-ticket-picture'),
	// $ctx: null,

	// Constructor
	init:function() {
		// OnayApp.$ctx = OnayApp.$canvas[0].getContext("2d");
		OnayApp.bindListeners();
		OnayApp.initJOB();

		if(typeof(Storage) !== "undefined") {
			if (localStorage.ticketNumber) {
				OnayApp.$ticketNumber.html(localStorage.ticketNumber);
				OnayApp.$infoText.fadeOut();
				OnayApp.showTicketNumber();
				OnayApp.showGetTicketBalanceButton();
			}
		}
	},
	bindListeners:function () {
		OnayApp.$addTicketButton.click(OnayApp.addTicketButtonClick);
		OnayApp.$getTicketBalanceButton.click(OnayApp.getTicketBalanceButtonClick);
		OnayApp.$addTicketFile.change(OnayApp.addTicketFileChange);
	},
	initJOB: function () {
		JOB.Init();
		JOB.SetImageCallback(function(result) {
			if(result.length>0){
				var ticketNumber =  result[0].Value;
				if (ticketNumber.length == 19 && $.isNumeric(ticketNumber)) {
					if(typeof(Storage) !== "undefined") {
						localStorage.ticketNumber = ticketNumber;
					}
					OnayApp.$ticketNumber.html(ticketNumber);
					OnayApp.$infoText.fadeOut();
					OnayApp.showTicketNumber();
					OnayApp.showGetTicketBalanceButton();
				}else{
					OnayApp.showError(OnayApp.errorMessage);
				}
			}else{
				if(result.length === 0) {
					OnayApp.showError(OnayApp.errorMessage);
				}
			}
			OnayApp.hideloadingIcon();
		});

		// JOB.PostOrientation = true;
		// JOB.SwitchLocalizationFeedback(true);
		// JOB.OrientationCallback = function(result) {
		// 	OnayApp.$canvas.width = result.width;
		// 	OnayApp.$canvas.height = result.height;
		// 	var data = OnayApp.$ctx.getImageData(0,0,OnayApp.$canvas.width,OnayApp.$canvas.height);
		// 	for(var i = 0; i < data.data.length; i++) {
		// 		data.data[i] = result.data[i];
		// 	}
		// 	OnayApp.$ctx.putImageData(data,0,0);
		// };
		// JOB.SetLocalizationCallback(function(result) {
		// 	OnayApp.$ctx.beginPath();
		// 	OnayApp.$ctx.lineWIdth = "2";
		// 	OnayApp.$ctx.strokeStyle="red";
		// 	for(var i = 0; i < result.length; i++) {
		// 		OnayApp.$ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height);
		// 	}
		// 	OnayApp.$ctx.stroke();
		// });

	},

	showTicketNumber:function () {
		OnayApp.$ticketNumber.addClass(OnayApp.ticketNumberVisibleClass);
	},
	hideTicketNumber:function () {
		OnayApp.$ticketNumber.removeClass(OnayApp.ticketNumberVisibleClass);
	},

	showloadingIcon:function () {
		OnayApp.$loadingIcon.addClass(OnayApp.loadingIconVisibleClass);
	},
	hideloadingIcon:function () {
		OnayApp.$loadingIcon.removeClass(OnayApp.loadingIconVisibleClass);
	},

	showGetTicketBalanceButton:function () {
		OnayApp.$getTicketBalanceButton.addClass(OnayApp.getTicketBalanceButtonVisibleClass);
	},
	hideGetTicketBalanceButton:function () {
		OnayApp.$getTicketBalanceButton.removeClass(OnayApp.getTicketBalanceButtonVisibleClass);
	},

	showTicketBalance:function () {
		OnayApp.$ticketBalance.addClass(OnayApp.ticketBalanceVisibleClass);
	},
	hideTicketBalance:function () {
		OnayApp.$ticketBalance.removeClass(OnayApp.ticketBalanceVisibleClass);
	},

	addTicketButtonClick: function(event) {
		navigator.camera.getPicture(OnayApp.onImageLoadSuccess, OnayApp.onImageLoadFail,
			{ quality: 50, destinationType: Camera.DestinationType.FILE_URI });
	},

	onImageLoadSuccess: function(imageURI) {
	    OnayApp.$displayImage.src = imageURI;
	    OnayApp.showloadingIcon();
		OnayApp.hideTicketBalance();
		OnayApp.hideTicketNumber();
		OnayApp.showError("Идет распознавание билета...");

		try {
			var URL = window.URL || window.webkitURL;
			OnayApp.$ticketNumber.innerHTML="";
			JOB.DecodeImage(OnayApp.$displayImage);
			URL.revokeObjectURL(OnayApp.$displayImage.src);
		}
		catch (e) {
			OnayApp.hideloadingIcon();
			OnayApp.showError("Ваше устройство не поддерживает это приложение");
		}
	},

	onImageLoadFail: function (message) {
	    alert('Failed because: ' + message);
	},

	getTicketBalanceButtonClick: function (event) {
		OnayApp.showloadingIcon();
		$.ajax({
		  url: OnayApp.requestUrl,
		  data: {pan: OnayApp.$ticketNumber.html()},
		  dataType: "json",
		  success: function (data) {
		  	OnayApp.hideloadingIcon();
		  	if (data.balance) {
		  		var balance = data.balance/100;
		  		OnayApp.$ticketBalance.html("Ваш баланс: "+balance+" тенге");
			  	OnayApp.showTicketBalance();
		  	}
		  	else{
		  		OnayApp.showError(OnayApp.error);
		  	}
		  },
		  error: function() {
		  	OnayApp.showError(OnayApp.error);
		  }
		});
	},

	showError: function (message){
		OnayApp.hideTicketNumber();
		OnayApp.hideGetTicketBalanceButton();
		OnayApp.hideTicketBalance();

		OnayApp.$infoText.fadeIn();
		OnayApp.$infoText.html(message);
	},

	// addTicketFileChange: function (event) {

	// 	var files = event.target.files;
	// 	if (files && files.length > 0)
	//   	{
	// 		OnayApp.showloadingIcon();
	// 		OnayApp.hideTicketBalance();

	//   		file = files[0];
	//   		try {
	//   			var URL = window.URL || window.webkitURL;
	//   			OnayApp.$displayImage.onload = function(event) {
	//   				OnayApp.$ticketNumber.innerHTML="";
	//   				JOB.DecodeImage(OnayApp.$displayImage);
	//   				URL.revokeObjectURL(OnayApp.$displayImage.src);
	//   			};
	//   			OnayApp.$displayImage.src = URL.createObjectURL(file);
	// 		}
	// 		catch (e) {
	// 			try {
	// 				var fileReader = new FileReader();
	// 				fileReader.onload = function (event) {
	// 					OnayApp.$displayImage.onload = function(event) {
	// 						OnayApp.$ticketNumber.innerHTML="";
	// 						JOB.DecodeImage(OnayApp.$displayImage);
	// 					};
	// 					OnayApp.$displayImage.src = event.target.result;
	// 				};
	// 				fileReader.readAsDataURL(file);
	// 			}
	// 			catch (e) {
	// 				OnayApp.hideloadingIcon();
	// 				OnayApp.showError("Ваше устройство не поддерживает это приложение");
	// 			}
	// 		}
	// 	}
	// }

}
