'use strict';

/*---- Hide and Show ---- */

$('#section-1-show').click(function() {
  $('#login').hide();
  $('#section-1').show();
  $('#register').hide()
  $('#intro-message').hide()
});

$('#logout-show').click(function() {
  $('#register').show();
  $('#login').show();
  $('#section-1').hide()
  $('#intro-message').show()
});

$('#new-event').click(function() {
  $('#enter-location').show();
  $('#create-location').show();
  $('#create-or-update').hide()
  $('#option1').hide()
  $('#option2').hide()
});

$('#update-an-event').click(function() {
  $('#enter-event').hide();
  $('#edit-event').show();
  $('#create-or-update').hide()
  $('#option1').hide()
  $('#option2').hide()
});

$('#promt-event-form').click(function() {
  $('#enter-event').show();
  $('#create-event').show();
});

/*---- Helper Functions ---- */
// $(document).ready(...
$(function() {
  var form2object = function(form) {
    var data = {};
    $(form).children().each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

/*---- Click Handlers for Register/Login/Logout ---- */

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    api.register(credentials, callback);
    e.preventDefault();
  });

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, data);
      user.id = data.user.id; // stores value of user.id
      user.token = data.user.token; // stores value of user.token
      console.log(user);
      $('.token').val(data.user.token);
    };
    e.preventDefault();
    api.login(credentials, cb);
  });

  $('#logout').on('submit', function(e) {
    var token = $('.token').val();
     // user.token;
    var id = user.id;
    e.preventDefault();
    api.logout(id, token, callback);
  });

/*---- Click Handlers for List/Create/Edit Events ---- */

  $('#list-events').on('submit', function(e) {
    var token = $('.token').val();
    e.preventDefault();
    api.listEvents(event, token, callback);
  });

  $('#create-event').on('submit', function(e) {
    var event = {
      business_kind: $('#business_kind').val(),
      name: $('#name').val(),
      website: $('#website').val(),
      phone_number: $('#phone_number').val(),
      event_date: $('#event_date').val(),
      group_size: $('#group_size').val(),
      location_id: $('#location_id').val(),
      user_id: $('#user_id').val()
      }
    var token = $('.token').val();
    var id = event.id;
    e.preventDefault();
    api.createEvent(event, token, createEventCB);
    });

  $('#edit-event').on('submit', function(e) {
    var eventData = {"event":
      {
        id: $('#event-id').val(),
        business_kind: $('#business_kind').val(),
        name: $('#name').val(),
        website: $('#website').val(),
        phone_number: $('#phone_number').val(),
        event_date: $('#event_date').val(),
        group_size: $('#group_size').val(),
        location_id: $('#location_id').val()
      }
    }
    var token = $('.token').val();
    e.preventDefault();
    editEventCB();

/*---- Callback Functions ---- */

// Create
  var createEventCB = function createEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }

    $('#eventId').val(data.event.id);
    callback(null, data);
  };

// List
  var listEventCB = function listEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }
    $('#eventId').val(data.event.id);
    callback(null, data);
  };

// Edit
  var editEventCB = function editEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }
    $('#eventId').val(eventData.event.id);
    callback(null, data);
  };

  });
});
