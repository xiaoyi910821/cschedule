var TaskView = Backbone.View.extend({

    el: '.community-show',

    render: function(eventList) {
    	var that=this;
    	this.events = eventList;
    	var ev_template = _.template($('#events-template').html());
    	$("#show-tasks").html(ev_template({
              events: that.events.models })
    	);
    }
});