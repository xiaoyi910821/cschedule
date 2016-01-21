var User = Backbone.Model.extend({ 
urlRoot: 'creator/invite',
	defaults:{
		email:'',
		username:'',
		mobile:''
	}
});	
var UserUpdate = Backbone.Model.extend({
	urlRoot:'creator',
});
