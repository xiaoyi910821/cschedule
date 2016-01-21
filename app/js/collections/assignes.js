var AssignesM = Backbone.Model.extend();

var AssignesC = Backbone.Collection.extend({

	model: AssignesM,

    //url: 'community/30001/event',
    
    parse: function(resp, xhr) {
        //debugger;
        return resp.event["30001"]; //[evAry[0]]  ;
    }   
});