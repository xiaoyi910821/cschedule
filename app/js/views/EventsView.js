var EventsViewC = Backbone.View.extend({

    initialize: function() {
        
        this.render();
    },

    render: function() {
        var that = this,
            taksCollection, assignessCollection;
        this.collection = new EventsC();

        
        this.collection.fetch({
          success: function(events) {
              var taskm, assignmentm, tasksC, assignmentC;
              //parsing events to approximate collections(taks assignees)
              _.each(events.models, function(event){
                  event.tasks = [];
                  _.each(event.get("task"), function(taskAttributes){
                      taskm = new Task(taskAttributes);
                      console.log("taskm="+taskm);
                      taskm.set("event-id",event.get("eventid"));
                      taskm.assignees = [];
                      _.each(taskAttributes.assignment, function(assignmentAttr){
                          assignmentm = new AssignesM(assignmentAttr);
                          assignmentm.set("task-id", taskm.get("taskid"));
                          taskm.assignees.push(assignmentm);
                       }); //end of assignees
                       event.tasks.push(taskm);
                  });//end of taks
              });//end of events


              // render events view code:: 
          }
        });


    }
});