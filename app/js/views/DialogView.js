var DialogView = Backbone.View.extend({
    el: '#messageDialog',
	
	render:function(id,name){
        var that = this;
		var template = _.template($('#messageBox-template').html());
		$('#messageDialog').html(template({id:id,name:name}));
	},
});