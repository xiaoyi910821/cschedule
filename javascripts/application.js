$(function() {


    var TaskHelper = Backbone.Model.extend({
        //url: 'schedules/1070068/onduty/1070000'
        url: 'task/30001/assignment'
    });
        
    var TaskHelpers = Backbone.Collection.extend({

        model: TaskHelper,
        url: 'schedules/1070068/onduty/1070000',

        parse: function(resp, xhr) {
            return resp.apgroup[0].member;
        }
    });
        



    var PoolMember = Backbone.Model.extend();

    var PoolMembers = Backbone.Collection.extend({

        model: PoolMember,

        url: 'task/30001/assignmentpool',


        parse: function(resp, xhr) {
            return resp.apgroup[0].member;
        }
    });



    var Event = Backbone.Model.extend();

    var Events = Backbone.Collection.extend({

        model: Event,

        url: 'community/30001/event',

        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function(resp, xhr) {

             debugger;

            function getAssignees(taskID, taskAssignees) {
                var names = "";
                var nameLen = 0;
                taskAssignees.forEach(function(name) {
                    if (nameLen < 1 && name.username.length > 7) {
                        names += '<div style="float:left;   text-align: center;"><div><img src=".\\images\\' 
                            + name.username + '.png"  height="32" width="32"></div><div>' + name.username + '</div></div>';
                    } else {
                        names += '<div style="float:left; margin-left:10px; text-align: center;"><div><img src=".\\images\\' 
                        + name.username + '.png"  height="32" width="32"></div><div>' + name.username + '</div></div>';
                    }
                    nameLen = name.username.length;
                });
                
                if (taskID === '30003') {
                    names += '<div class="poolIcon" task-id="' + taskID * 1.0 
                        + '" style="float:left; margin-left:10px;text-align: center; color: lightgray;">' 
                        + '<div><img src=".\\images\\needed.png" height="32" width="32"></div><div>needed</div></div>';
                }
                names += '<div class="poolIcon" task-id="' + taskID * 1.0 
                + '" style=" right: 3px; position: absolute; text-align: center; color: lightgray;">' 
                + '<div><img src=".\\images\\poolIcon.png" height="32" width="32"></div><div>pool</div></div>';
                names += '<div style="clear:both"></div>';
                return names;
            }


            var evAry = [];
            var evsC = resp.event;

            var events = {
                events: [ // put the array in the `events` property
                    {
                        title: 'event1',
                        start: '2015-05-02'
                    }, {
                        title: 'event2',
                        start: '2015-05-02',
                        end: '2015-05-04'
                    }, {
                        title: 'event3',
                        start: '2015-05-04T12:30:00',
                    }
                ],
                color: 'black', // an option!
                textColor: 'yellow' // an option!
            };



            var eventsC = {
                events: [],
                color: 'white', // an option!
                textColor: 'black' // an option!
            };

            var eventID = 30001;
            var evsC = evsC[eventID];
            var assignNames = "";

            for (var dayIdx = 0; dayIdx < evsC.length; dayIdx++) {

                assignNames = "";
                for (var taskIdx = 0; taskIdx < evsC[dayIdx].task.length; taskIdx++) {
                    var taskID = evsC[dayIdx].task[taskIdx].taskid;
                    assignNames += '<div class="taskAssignees" data-taskid="' + taskID
                                    + '" style="margin-top:10px;">' 
                        + getAssignees(taskID, evsC[dayIdx].task[taskIdx].assignment) + '</div>';
                }

                var newEv = {
                    title: assignNames, //'Group ' + getAssignees(evsC[dayIdx].task[0].assignment),
                    start: evsC[dayIdx].startdatetime
                };
                eventsC.events.push(newEv);




                if ($(".addtaskbtn").length === 0) {
                    var eventNm = evsC[dayIdx].eventname; //this.collection[0].eventname;
                    var times = evsC[dayIdx].startdatetime.split(' ')[1].split(':');
                    var eventTime = times[dayIdx] + ':' + times[1];

                    var tasks = evsC[dayIdx].task;


                    $('#event1_title').append('<div  contenteditable="true"  style="margin-top:10px;">' + eventNm + '  ' + eventTime + '</div>');
                    $('#event1_title').append('<button class="addtaskbtn" data-eventid="' + eventID + '">+ new</button>');

                    for (taskid = 0; taskid < tasks.length; taskid++) {

                        $('#event1_title').append('<div class="taskname" contenteditable="true">' + '<div>' + tasks[taskid].taskname + '</div>');
                    }
                }

            }
            //$('#event1_title').   

            //Object {color: "black", textColor: "yellow", events: Array[1]}
            // eventsC.events[0]

            // Object {title: "300011", start: "2015-03-06 20:30:00"}



            //Object {events: Array[3], color: "black", textColor: "yellow"}
            //Object {title: "event1", start: "2015-05-02"}

            return eventsC; //[evAry[0]]  ;
        },
    });


    /*
    $('#calendar').fullCalendar({
        eventSources: [
            // your event source
            {
                events: [ // put the array in the `events` property
                    {
                        title  : 'event1',
                        start  : '2015-05-02'
                    },
                    {
                        title  : 'event2',
                        start  : '2015-05-02',
                        end    : '2015-05-04'
                    },
                    {
                        title  : 'event3',
                        start  : '2015-05-04T12:30:00',
                    }
                ],
                color: 'black',     // an option!
                textColor: 'yellow' // an option!
            }
            // any other event sources...
        ]
    });
        
    */




    var HelpersPoolView = Backbone.View.extend({
        
        el: "#floatDiv",
        collection: PoolMembers,
        
        initialize: function() {
            
            /*
            _.bindAll(this);
            this.helpersPoolView = new HelpersPoolView();
            */
        },

        events : {
            'click #closeHelpers' : 'closeHelpersBox'
        },
        
        closeHelpersBox: function(ev) {
            var helpersDiv = $("#floatDiv").hide();
            helpersDiv.find(".helperPoolLI").remove();
            
        },
        
        render: function() {
            // var poolID = $(jsEvent.toElement).closest(".poolIcon").attr('task-id');

            var pool = new PoolMembers();
            pool.fetch({ //EventList().fetch({
                /*
                data: {
                  from: start.getTime(),
                  to: end.getTime()
                },
                    
                One important adjustment, I had to convert the moment object to a 
                Javascript date object to get the getTime() function to work.
                data: {
                from: start.toDate().getTime(),
                to: end.toDate().getTime()
                }, //data
                */
                success: function(eventList) {
                    events = [];
                    events = _.map(eventList.models, function(event) {
                        var title = event.attributes.username;
                        var pic = event.attributes.userprofile;
                        var id = event.attributes.userid;

                        var personDiv = $("<div data-id='" + id + "' class='helperPoolLI' style='float:right; margin-left:8px; margin-right:8px;'>");

                        personDiv.append("<img src='" + pic + "'>");
                        personDiv.append("<div>" + title);
                        if (title === 'Irene')
                            personDiv.append("<div style='color: goldenrod;'>after July");
                        personDiv.draggable();
                        $("#floatDiv").append(personDiv);

                        //return newEv;
                    });
                    $("#floatDiv").show();
                }
            });

            //this.eventView.model = this.collection.get(fcEvent.id);
            //this.eventView.render();
        }
    });
                                          
                                          

    
    var EventsView = Backbone.View.extend({
        
        //el: '#calendar',
        //collection: events,

        initialize: function() {
            //_.bindAll(this);

            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);
            this.collection.bind('addToTask', this.addToTask);
            this.collection.bind('destroy', this.destroy);

            this.eventView = new EventView();
        },

        events : {
            'dragenter .droparea' : 'tellDrop',
                'dragenter .droparea' : 'highlightDropZone',
                'dragleave .droparea' : 'unhighlightDropZone',
        },
                                          
        tellDrop : function(){alert("DROPPED!")},
        
        highlightDropZone: function(e) {
            e.preventDefault();
            //$(e.currentTarget).addClass('item-drop-zone-highlight')
        },

        unhighlightDropZone: function(e) {
            //$(e.currentTarget).removeClass('item-drop-zone-highlight')
        },
        
        render: function() {
            $(this.el).fullCalendar({
                header: {
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'members' //WFB 'alldays,month,basicWeek,basicDay,members'
                },
                
                timeFormat: '',
                
                views: {
                    alldays: {
                        type: 'month',
                        duration: {
                            days: 30
                        },
                        hiddenDays: [],
                        buttonText: 'calender',

                        aspectRatio: 1.2,
                        fixedWeekCount: true
                    },
                    members: {
                        type: 'month',
                        duration: {
                            days: 30
                        },
                        hiddenDays: [],
                        buttonText: '<Show all members',

                        aspectRatio: 1.2,
                        fixedWeekCount: true
                    }
                },

                selectable:     true,
                selectHelper:   true,
                editable:       true,
                ignoreTimezone: false,
                
                select:      this.select,
                eventClick:  this.eventClick,
                eventDrop:   this.eventDropOrResize,
                eventResize: this.eventDropOrResize,

                hiddenDays:     [0, 1, 2, 3, 4, 6],
                aspectRatio:    4.1,
                fixedWeekCount: false,
                
                droppable: true,
                /*
                drop: function(date, jsEvent, ui ) {
                    var droppedID = $(this).data('id');
                    this.addToTask(date);
                },
                */



                eventSources: [ {// your event source
                    events: function(start, end, timezone, callback) {
                        var newEvents = new Events();
                        newEvents.fetch({ //EventList().fetch({
                            /*
                            data: {
                              from: start.getTime(),
                              to: end.getTime()
                            },
                            */
                            success: function(eventList) {
                                events = []
                                events = _.map(eventList.models, function(event) {
                                    var newEv = {
                                        title: event.get("title"),
                                        start: new Date(event.get("start")),
                                        //end: new Date(event.get("end")),
                                        //url: event.get("url")
                                    };
                                    newEv.title = event.attributes.events[0].title;
                                    newEv.start = event.attributes.events[0].start;
                                    return newEv;
                                });

                                events[0].start = "2015-07-03 20:30:00";
                                callback(events);

                                $(".taskAssignees").droppable({
                                      drop: function( event, ui ) {
                                          // this is the elem receiving the dropped ui.draggable elem
                                        var newHelperID = ui.draggable.data('id');
                                        var taskID =$(this).data('taskid');

                                        //alert( "Dropped helper " + newHelperID );
                                          //var taskHelpers = new TaskHelpers();
                                          //taskHelpers.fetch({ //EventList().fetch({
                                              //success: function(eventList) {

                                                var taskHelper = new TaskHelper(
                                                                  {
'id' : 123,                                                                    'ownerid': '3',
                                                                    'eventid': taskID,
                                                                     'id': '125' //newHelperID
                                                                    //'add': [newHelperID]
                                                                  });
                                                taskHelper.save();
                                              //}
                                        //});
                                    }
                                });


                                //$('.poolIcon').click( function(){alert(event)} );
                            }
                        })
                    },
                    color:     'white',
                    textColor: 'black'
                }]  //eventSources
            });
            

            $(".taskAssignees").droppable({
                  drop: function( event, ui ) {
                    alert( "Dropped!" );
                  }
            });

            /*
            renderCalendar: ->
                  @.$("#calendar").fullCalendar({
                    header: {
                      left: 'prev,next today'
                      center: 'title'
                      right: 'month,basicWeek,basicDay'
                    }
                    allDayDefault: false
                    editable: false
                    events: (start, end, callback) ->
                      new EventList().fetch({
                        data: {
                          from: start.getTime()
                          to: end.getTime()
                        }
                        success: (eventList) ->
                          events = []
                          events = _.map(eventList.models, (event) -> {
                            title: event.get("title")
                            start: new Date(event.get("start"))
                            end: new Date(event.get("end"))
                            url: event.get("url")
                          })
                          callback(events)
                      })
                  })
            */



        },
        
        addAll: function() {
            //WFB this.el.fullCalendar('addEventSource', this.collection.toJSON())
            // CHANGED TO USE EVENT FUNCTION this.el.fullCalendar('addEventSource', this.collection.toJSON()[0]);
        },
        
        addOne: function(event) {
            this.el.fullCalendar('renderEvent', event.toJSON());
        },
        

        addToTask: function(eventDate) {
            var personID = (this).data('id');
            var taskHelpers = new TaskHelpers();
            var taskHelper = new TaskHelper({id: personID});
            taskHelpers.add(taskHelper);
            taskHelpers.save();
        },

                                                          
                
/*
    $url = 'http://apitest1.servicescheduler.net/schedules/1070068/onduty/1070000';    
    $method = 'PUT';
        // Please change the data before executing it in the test1 environment
        // "add" ---- assign participants to the task
    // "delete"   delete participants from the task
    $data = json_encode(array(
        'ownerid'=> '107',
        'eventid' => '300011',
            'add' => array(235, 236),
        'delete' => array(234)
        )       
    );
*/
        select: function(startDate, endDate) {
            this.eventView.collection = this.collection;
            this.eventView.model = new Event({
                start: startDate,
                end: endDate
            });
            this.eventView.render();
        },


        eventClick: function(fcEvent, jsEvent, view) {
            var helpersPoolView = new HelpersPoolView( {'poolID' : $(jsEvent.toElement).closest(".poolIcon").attr('task-id')} );
            helpersPoolView.render();
        },
            
        change: function(event) {
            // Look up the underlying event in the calendar and update its details from the model
            var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.title = event.get('title');
            fcEvent.color = event.get('color');
            this.el.fullCalendar('updateEvent', fcEvent);
        },
        eventDropOrResize: function(fcEvent) {
            // Lookup the model that has the ID of the event and update its attributes
            this.collection.get(fcEvent.id).save({
                start: fcEvent.start,
                end: fcEvent.end
            });
        },
        destroy: function(event) {
            this.el.fullCalendar('removeEvents', event.id);
        }
    });




    var EventView = Backbone.View.extend({
        el: $('#eventDialog'),
        initialize: function() {
            //_.bindAll(this);
        },
        render: function() {
            var buttons = {
                'Ok': this.save
            };
            if (!this.model.isNew()) {
                _.extend(buttons, {
                    'Delete': this.destroy
                });
            }
            _.extend(buttons, {
                'Cancel': this.close
            });

            this.el.dialog({
                modal: true,
                title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
                buttons: buttons,
                open: this.open
            });

            return this;
        },
        open: function() {
            this.$('#title').val(this.model.get('title'));
            this.$('#color').val(this.model.get('color'));
        },
        save: function() {
            this.model.set({
                'title': this.$('#title').val(),
                'color': this.$('#color').val()
            });

            if (this.model.isNew()) {
                this.collection.create(this.model, {
                    success: this.close
                });
            } else {
                this.model.save({}, {
                    success: this.close
                });
            }
        },
        close: function() {
            this.el.dialog('close');
        },
        destroy: function() {
            this.model.destroy({
                success: this.close
            });
        }
    });

    var communityEvents = new Events();
    
        /* Kalyani 
          var events = new Events();
        */
    if (false) {
        new EventsView({
            el: $("#calendar"),
            collection: communityEvents
        }).render();
    }
    
        //events.fetch();

        var userListView = new UserListView();

        var userAddView = new UserAddView();
        var participantView = new ParticipantView();
        userListView.render();
    
    
    var communityListView = new CommunityListView();
    communityListView.render();
    //var loggedInuserView = new loggedUserView();
    //loggedInuserView.render();

});