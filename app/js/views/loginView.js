var UserLogin = Backbone.Model.extend({
	urlRoot: 'creator/signin',
	defaults:{
		email:'',
		password:'',
	}
});
var ResetPassword = Backbone.Model.extend({
	urlRoot: 'creator/resetpw',
	defaults:{
		email:'',
	}
});

var UserRegister = Backbone.Model.extend({ 
	urlRoot: 'creator/register',
	defaults:{
		email:'',
		username:'',
		password:'',
		mobile:'',
	}
});

var user_details;
var LoginAndRegisterView = Backbone.View.extend({
	el:'#loginAndRegisterPanel',
	events:{
		'click #submitForLogin':'login',
		'click #submitForRegister':'register',
		'click #sumbitForResetPassword':'resetPassword',
		'click #showResetPasswordForm': 'showResetPasswordForm',
		'click #showRegisterForm': 'showRegisterForm',
		'click #showLoginForm':'showLoginForm',
	},
	login:function(){
		var email = $('#loginEmail').val();
		var password = $('#loginPassword').val();
		var userLogin = new UserLogin();
		userLogin.save({email:email,password:password},{
			success: function(response){
				
				alert("Login success! "+response.attributes.username+". You id is "+response.attributes.ownerid+". You email is "+response.attributes.email+" .");
				gLoginUser = response.attributes;
				user_details = JSON.stringify(gLoginUser);
				localStorage.setItem("login_user" , user_details);
                //window.location = '../public/community.html';
				window.location = './community.html'
				
			},
			error:function(){
				alert("Login error!");
			}
		})
	},
	showRegisterForm: function(){
		$("#userLogin").hide();
		$("#resetPassword").hide();
		$("#userRegister").show();
	},
	showResetPasswordForm:function(){
		$("#userLogin").hide();
		$("#resetPassword").show();
		$("#userRegister").hide();
	},
	showLoginForm:function(){
		$("#userLogin").show();
		$("#resetPassword").hide();
		$("#userRegister").hide();
	},
	resetPassword:function(){
		var email = $("#resetEmail").val();
		var resetPassword = new ResetPassword();
		resetPassword.save({email:email},{
			success:function(){
				alert("A reset password email has been sent to your E-mail");
			},
			error:function(){
				alert("The E-mail you input is not exist!");
			}
		})
	},
	register: function(){
		var email = $("#registerEmail").val();
		var username = $("#registerUserName").val();
		var password = $("#registerPassword").val();
		var mobile = $("#registerMobile").val();
		var userRegister = new UserRegister();
		userRegister.save({email:email,username:username,password:password,mobile:mobile},{
			success:function(response){
				alert("Register success! You name is "+response.attributes.username+". You id is "+response.attributes.ownerid+". You email is "+response.attributes.email+" .");
				  window.location = '../public/community.html';
			},

			error:function(){
				alert("Register fail!");
			}
		})
	},
	render:function(){
		var template = _.template($('#user-login-template').html());              
        $("#loginAndRegisterPanel").html(template());
	},
	
	
});



var loginAndRegisterView = new LoginAndRegisterView();
loginAndRegisterView.render();

