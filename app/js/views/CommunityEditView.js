	var CommunityEditView = Backbone.View.extend({
		el: '.edit-community-div',

		communitynames:null,

		events: {
			'click .btn-edit-save': 'updateCommunity',
			"click .btn-edit-cancel": 'cancelEditCommunity'
		},

		initialize: function() {
			var handler = _.bind(this.render, this);
		},

		updateCommunity: function(ev) {
			
				var name = $('.editCommunity input')[0].value;

				 if( _.contains(this.communitynames,name)) {
	              		alert("Enter valid community name,Community name already Exists");
	               }  else {
						this.model.set('communityname', name);
						this.model.save();
						alert(" successfully edited Community");
		        }
			
			$('.editCommunity').hide();

		},
			
			
		cancelEditCommunity: function() {
			$('.editCommunity').hide();
		},

		render: function(communitynames) {
			 var that = this;
	        this.communitynames = communitynames
			$('.editCommunity input')[0].value = this.model.get("communityname");
			$('.editCommunity').show();
			$('.createCommunity').hide();
		}
		

	});