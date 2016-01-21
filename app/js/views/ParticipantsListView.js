var ParticipantsListView = Backbone.View.extend({
    el: '.participantList',

	events: {
		/*'dblclick .participant' : 'showDetails',
		'click .participant' : 'messageBox'*/
	},
	
	/*
	messageBox: function(ev) {
		alert("Yes message box");
		var participant = $(ev.target).closest('li'),
			id = $(participant[0]).data('id'),
			name = $(participant[0]).data('name');
		//$('#messageDialog').attr("title", "Chat with " + name);	
				
		var dialogView = new DialogView();
        
		dialogView.render(id,name);
		$('#messageDialog').dialog({
			title: "Chat with " + name
        });
		
		
		getNonce()

		// Use the nonce to get an identity token
		.then(function(nonce) {
			return getIdentityToken(nonce);
		})

		// Use the identity token to get a session
		.then(function(identityToken) {
			return getSession(identityToken);
		})

		// Store the sessionToken so we can use it in the header for our requests
		.then(function(sessionToken) {
			layersample.headers.Authorization = 'Layer session-token="' + sessionToken + '"';
			// Now we can do stuff, like get a list of conversations
			return getConversations();
		})

		.then(function(conversations){
			return createConversation(["123",id]);     
		})

		.then(function(conversation) {
			layersample.conversationUrl = conversation.url;
		});
	},*/
	
	/*
	showDetails: function(ev) {
		alert("Yes show details");
		var participant =$(ev.target).closest('li');
		var email = $(participant[0]).data('email'); 		
		var participantView = new ParticipantView();
		participantView.render(email);
		$('#participantDialog').dialog();
        //ev.preventDefault();
	}, */
	
    render: function () {
		gParticipants = new Participants()
		$('<ul>' +
			'<li>' +
				'<img src = images/plus.png> Add Participant' +
			'</li>' + 
		'</ul>').appendTo('#display-user-form');
		gParticipants.fetch({
            success: function (gParticipants) {
				$.each(gParticipants.models, function(p) {
					participant = gParticipants.models[p];
					$('<ul>' +
						'<li data-id=' + participant.id +
							' data-email=' + participant.get('email') +
							' data-name=' + participant.get('name') +
							' class=participant>' + 
							'<img src=' + participant.get('profile') + '> ' + 
							participant.get('name') +
						'</li>' + 
					'</ul>').appendTo('#display-user-form');
				});
				$("#ParticipantDiv").css("display", "block");
			}
		}); 
    }
	

});

