$(function() {


//==========================================================================
//======================start sign up process================================
//==========================================================================

$('#signup-button').click(function() {
	console.log("testing signup button");

	showSignUpForm();

});

//==========================================================================
//=======================start sign in process==============================
//==========================================================================

$('#signin-button').click(function(){

	console.log('testing sign in button');
	showSignInForm();

});

//==========================================================================
//=======================go to profile page=================================
//==========================================================================

$('#profile-link').click(function(){
	console.log('test profile link');
	showProfilePage();
});

//==========================================================================
//=======================logout=============================================
//==========================================================================


$('#signout').click(function(){
	Cookies.remove('loggedinId');
	location.reload();
});

//==========================================================================
//=======================search submit click event==========================
//==========================================================================

$('#search-submit').click(function() {
	console.log("Testing search submit")
	$('#artist-name').empty();
	searchSubmit();
});


//==========================================================================
//=======================Render sign in form================================
//==========================================================================

var showSignInForm = function() {

	$('#signin-button').hide();
	$('#signup-button').hide();
	$('#signup-form').remove();

	var template = Handlebars.compile($('#signin-form-template').html());

	$('#form-container').append( template );

	$('#signin-submit').click(function() {
		console.log("testing submit");

		$('#signin-form-template').hide();

		signinSubmit();
	});

}


//==========================================================================
//=======================Render sign up form================================
//==========================================================================

var showSignUpForm = function() {

	$('#signup-button').hide();

	var template = Handlebars.compile($('#signup-form-template').html());

	$('#form-container').append( template );

	$('#signup-submit').click(function() {
		console.log("testing submit");
		

		$('#signup-form-template').hide();


		signupSubmit();
	});

};

//==========================================================================
//=======================AJAX post request for sign up======================
//==========================================================================

	var signupSubmit = function() {

		var emailInput = $("input[id='email']").val()

	    var usernameInput = $("input[id='username']").val()

	    var passwordInput = $("input[id='password']").val()

	    var imageInput = $("input[id='profilePicture']").val()

	    var user = {
	    	email: emailInput,
	        username: usernameInput,
	        password: passwordInput,
	        image: imageInput
	    };
	    event.preventDefault();

	    $.ajax({
			url: 'http://localhost:3000/users',
			method: 'POST',
			dataType: 'json',
			data: user
		}).done(loggedIn);

	};

//==========================================================================
//=======================AJAX post request for sign in======================
//==========================================================================

var signinSubmit = function() {
		var emailInput = $('#email').val();
		var passwordInput = $('#password').val();
		console.log('here at signinsubmit');
		event.preventDefault();

		var userLogin = {
			email: emailInput,
			password: passwordInput
		};

    $.ajax({
			url: 'http://localhost:3000/login',
			type: 'POST',
			dataType: 'json',
			data: userLogin
		}).done(loggedIn).fail(function(){
			alert('wrong password or email!');
		});
};

//==========================================================================
//=======================Render logged in page==============================
//==========================================================================

var loggedIn = function(data) {
	$('#username-container').html('Welcome, ' + data.username);
	$('#signup-button').hide();
	$('#signin-button').hide();
	$('#signin-form').remove();
	$('#signup-form').remove();
	$('#signout').show();
	$('#profile-link').show();
	$("#new-review").show();
	$("#new-review").click(function() {
		showReviewForm();
	});
}


//==========================================================================
//=======================AJAX post request for adding review================
//==========================================================================


var createReview = function() {
	$('#review-form-template').hide();
	var starsInput = parseInt($('#stars').val());
	var contentInput = $('#content').val();
	var userIdInput = Cookies.get("loggedinId");
	var eventIdInput = $(this).parent().parent().attr("data-id");
	var datetimeInput = $(this).parent().parent().attr("datetime");
	var artistInput = $(this).parent().parent().attr("artist");
	var venueNameInput = $(this).parent().parent().attr("venue-name");
	var venueCityInput = $(this).parent().parent().attr("venue-city");
	var venueRegionInput = $(this).parent().parent().attr("venue-region");
	var venueCountryInput = $(this).parent().parent().attr("venue-country");

	console.log(eventIdInput, datetimeInput, artistInput, venueNameInput, venueCityInput, venueRegionInput, venueCountryInput);
	event.preventDefault();
	var reviewData = {
		stars: starsInput,
		content: contentInput,
		user_id: userIdInput,
		event_id: eventIdInput,
		datetime: datetimeInput,
		artist: artistInput,
		venueName: venueNameInput,
		venueCity: venueCityInput,
		venueRegion: venueRegionInput,
		venueCountry: venueCountryInput
	};
		$.ajax({
			url: "http://localhost:3000/users/" + userIdInput + "/reviews",
			type: "POST",
			dataType: 'json',
			data: reviewData
		}).done(console.log("created review!"));
}

//==========================================================================
//===========================Create new review==============================
//==========================================================================


var showReviewForm = function() {
	console.log("compiling form");
	console.log(this);
	// console.log(this).parent();
	$('#new-review').hide();

	var template = Handlebars.compile($('#review-form-template').html());

	$(this).parent().append( template );
	// $('#form-container').append( template );

	$('#review-submit').click(createReview);
	

};


//==========================================================================
//=======================AJAX get request for listing reviews===============
//==========================================================================

$.get('/reviews', function(data){


	for (i = 0; i < data.length; i++) {
		console.log(data.length);
		var source = $("#review-compile-template").html();
		var template = Handlebars.compile(source);
		var context = {stars: data[i]['stars'], username: data[i]['user_id'].username, content: data[i]['content'] }
		var html = template(context);
		$('body').append(html);
	}

});


var checkCookies = function() {

	if (Cookies.get("loggedinId") != null) {
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId"),
			method: "GET",
			dataTyp: "json"
		}).done(loggedIn);
		
	}
}

checkCookies();




//==========================================================================
//=======================Katie's Work Space=================================
//==========================================================================














//==========================================================================
//==========================================================================
//==========================================================================





//==========================================================================
//=======================Zach's Work Space==================================
//==========================================================================

//==========================================================================
//=======================Render profile page================================
//==========================================================================

var showProfilePage = function() {
	console.log('show profile is working');
	$.get('/users/:id', function(data){
			console.log(data);
			var source = $("#profile-compile-template").html();
			var template = Handlebars.compile(source);
			var context = {username: data.username, image: data.image, reviews: data.reviews };
			var html = template(context);
			$('body').append(html);


	});

};












//==========================================================================
//==========================================================================
//==========================================================================







//==========================================================================
//=======================Robbies's Work Space===============================
//==========================================================================

var searchSubmit = function() {
	$('#venue-info').empty();
	console.log("testing searchSubmit function");
	event.preventDefault();

	var searchInput = $('#search-bar').val();

	var searchVals = {
		artist: searchInput
	}

	$.ajax({
		url: "http://localhost:3000/search",
		type: "POST",
		dataType: 'json',
		data: searchVals
	}).done( showSearchResults );

}

var showSearchResults = function(data) {
	console.log("testing show result function");
	console.log(data);

	$('#artist-container').show();
	$("#artist-name").remove();

	$('#artist-container').append("<li id='artist-name'></li>");
	$('#artist-name').html( data.name );

	$('#artist-name').click(function(){

		$.ajax({
			url: "http://api.bandsintown.com/artists/" + data.name + "/events?format=json&app_id=stannis&date=2009-01-01," + moment().format(),
			type: "GET",
			dataType: 'jsonp'
		}).done(loadConcerts);
		
	});
	
};


// var getComplaints = function() {
// 	$.ajax({
// 		url: "http://localhost:3000/complaints",
// 		method: "GET",
// 		dataType: "json"
// 	}).done(renderComplaints);
// };

// var renderComplaints = function(data) {
// 	var resultDiv = $('#horizontal');
// 	var complaintTemplate = $("#complaint-template");
// 	complaintContainer.empty();
// 	complaintContainer.show();
// 	$('#new-instructor-link').hide();
// 	$('#new-complaint-link').show();

// 	var complaintTemplate = Handlebars.compile($('#complaint-template').html());
// 	for(var i=0;i<data.length;i++) {
// 		resultDiv.append(complaintTemplate(data[i]))
// 	};
// };


var loadConcerts = function(data) {
	var resultDiv = $("#concert-info");
	
	resultDiv.empty();
	resultDiv.show();

	var concertTemplate = Handlebars.compile($("#concert-template").html());
	if(data.length < 10) {
		$('#concert-info').empty();
		for (i = 0; i < data.length; i++) {
			resultDiv.append(concertTemplate(data[i]));
		}
	}

	else {
		$('#concert-info').empty();
		for (i = data.length - 1 ; i > data.length - 10; i--) {
			resultDiv.append(concertTemplate(data[i]));
		}
	}

	var createReview = $(".create-review")
	for (var i = 0; i < createReview.length; i++) {
		$(createReview[i]).click(showReviewForm);
	};
}









//==========================================================================
//==========================================================================
//==========================================================================







});