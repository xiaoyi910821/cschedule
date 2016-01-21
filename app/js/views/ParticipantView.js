var ParticipantView = Backbone.View.extend({
    el: '#participantDialog',
	events:{
		'click #deleteParticipant':'deleteParticipant',
		'click #updateUser':'updateUser',
	},
	
    render: function (email) {
		var user = gParticipants.findWhere({id: gLoginUserId}); 
		$("#editProfileImage").append(loadTemplate("#participantEditViewTpl","#participantEditViewTemplate"));
		var template = _.template($('#participant-show').html());    
		$("#participant-show").html(template({user: user.attributes}));
		addImageEvents();
    }, 
	
	updateUser:function(ev){
		var userUpdate = new UserUpdate();
		var username = $("#updateusername").html();
		var mobile = $("#updatemobile").html();
		var profilePic = gLoginUserId + ".png";
		userUpdate.save({id:ev.target.value,username:username,mobile:mobile,profile:profilePic},{
			success:function(){
				var participantsListView = new ParticipantsListView();
				participantsListView.render();
				$('#participantDialog').dialog('close');
			}
		});
	},
	
	deleteParticipant: function(ev){
		var participant = new Participant({id:ev.target.value});
		participant.destroy({
			success: function(){
				var participantsListView = new ParticipantsListView();
	            participantsListView.render(); 
				$('#participantDialog').dialog('close');
			},
		});		
	}
});


