var UserAddView = Backbone.View.extend({
    el: '.participantList',	
    events: {
		'click #searchForMember': 'searchForMember',
		'click #deleteParticipant':'deleteParticipant',
		'click #addMember':'addMember',
		'click #cancelAddMember':'cancelAddMember',
    },
	
	initialize: function(){
      _.bindAll(this, "render");
    },
	
	searchForMember: function(){
		var userDetails = $('#email').val();
		emailreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if(userDetails.match(emailreg) == null){
			$('#emaildiv').show();
			}
		else{							
			var users = new Users();
			users.fetch({
				data: $.param({email: userDetails}),		
				error:function(){
					$('#emaildiv').hide();
					$('#edit-user-form').show();
					$('#inputEmail').val(userDetails);
				},
				success: function(data){
					var participant = new Participant();
					participant.save({userid:users.models[0].attributes.id,
									  name:users.models[0].attributes.username,
									  email:users.models[0].attributes.email,
									   mobile:users.models[0].attributes.mobile
									 },
									 {
										  success: function(){
											  var participantsListView = new ParticipantsListView();
											  participantsListView.render();
											  $('.participant').draggable();
										  }
									 }
				  );				         
			  }				
		   });
		}
    },
    
	addMember: function(){
		var name = $('#inputName').val();
		var email = $('#inputEmail').val();
		var mobile = $('#inputMobile').val();
		emailreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if(name==""){
			$("#nameDiv").show();
		}
		else if(email.match(emailreg) == null){
			$("#nameDiv").hide();		
			$('#inputEmailFormat').show();
			}
		else{
			var user = new User();
			user.save({username: name,email:email,mobile:mobile},{
				success:function(){
					var users = new Users();
					users.fetch({
						data: $.param({email: email}),
						success:function(data){
							var participant = new Participant();
							participant.save({userid:users.models[0].attributes.id,
											  name:users.models[0].attributes.username,
											  email:users.models[0].attributes.email,
											  mobile:users.models[0].attributes.mobile   
											 },
											 {
												 success: function(){
													 var participantsListView = new ParticipantsListView();
													 participantsListView.render();
													 $('.participant').draggable();
												 }
											 }
							);		
					   },					
				   });	
			   },
			});	
		}
	},	
	cancelAddMember:function(){
		var participantsListView = new ParticipantsListView();
	    participantsListView.render(); 
	},
	deleteParticipant: function(ev){
		var participant = new Participant({id:ev.target.value});
		participant.destroy({
			success: function(){
				var participantsListView = new ParticipantsListView();
	            participantsListView.render(); 
			},
			});
		
	},
   
});
 
