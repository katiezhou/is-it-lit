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
//=======================search submit click event==========================
//==========================================================================

$('#edit-profile').click(function() {
	console.log("Testing edit profile button")
	//calls function to show edit form
	updateForm();
})


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
	$("#new-review").show();
	$("#new-review").click(function() {
		showReviewForm();
	});
}


//==========================================================================
//===========================Create new review==============================
//==========================================================================


var showReviewForm = function() {

	$('#new-review').hide();

	var template = Handlebars.compile($('#review-form-template').html());

	$('#form-container').append( template );

	$('#review-submit').click(function() {
		console.log("testing submit");
		

		$('#review-form-template').hide();


		createReview();
	});

};

//==========================================================================
//=======================AJAX post request for adding review================
//==========================================================================


var createReview = function() {
	var starsInput = parseInt($('#stars').val());
	var contentInput = $('#content').val();
	var userIdInput = Cookies.get("loggedinId");
	event.preventDefault();
	var reviewData = {
		stars: starsInput,
		content: contentInput,
		user_id: userIdInput
	};
		$.ajax({
			url: "http://localhost:3000/users/" + userIdInput + "/reviews",
			type: "POST",
			dataType: 'json',
			data: reviewData
		}).done(console.log("created review!"));
}

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

var loadConcerts = function(data) {
	console.log(data);
	$('#venue-info').show();
	if(data.length < 10) {
		$('#venue-info').empty();
		for (i = 0; i < data.length; i++) {
			$('#venue-info').append(data[i]['venue']['name']);
			$('#venue-info').append(data[i]['venue']['city']);
			$('#venue-info').append(data[i]['venue']['region']);
			$('#venue-info').append(data[i]['venue']['country']);
		}
	}

	else {
		$('#venue-info').empty();
		for (i = data.length - 1 ; i > data.length - 10; i--) {
			// $('#venue-info').append("<div id='venue-container'></div>")
			$('#venue-info').append("<li>" + data[i]['venue']['name'] + "</li>");
			$('#venue-info').append("<li>" + data[i]['venue']['city'] + "</li>");
			$('#venue-info').append("<li>" + data[i]['venue']['region'] + "</li>");
			$('#venue-info').append("<li>" + data[i]['venue']['country'] + "</li>" + "<br />");
		}
	}
}

var updateForm = function() {
	//displays form to edit user
	var template = Handlebars.compile($('#edit-user-template').html());

	$('#edit-container').append( template );

	$('#edit-user-submit').click(function() {
		console.log("testing edit-user-submit");
		editUser();
	});

	//displays click event that fires off editUser function 
}

var editUser = function() {
	var id = Cookies.get("loggedinId");
	console.log(id);

	var ePw = $('#edited-email').val();
	var eUn = $('#edited-username').val();
	var eEm = $('#edited-password').val();
	var eImg = $('#edited-profilePicture').val();


	var editedUser = {
		id: id,
		edited_password_hash: ePw,
	  edited_username: eUn,
	  edited_email: eEm,
	  edited_image: eImg
	}

	$.ajax({
		url: "http://localhost:3000/users/" + id,
		method: "GET",
		data: editedUser,
	}).done( showProfilePage );
}








//==========================================================================
//==========================================================================
//==========================================================================







});