'use strict';


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



var user = {
  id: null,
  token: null
};

var api = {

  url: 'http://localhost:3000',

  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxhr: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  logout: function logout(id, token, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/logout/' + id,
      headers: {
        Authorization:'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },


//Authenticated api actions
  listEvents: function list(event, token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  createEvent: function create(event, token, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events/',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({event}),
      dataType: 'json',
    }, callback);
  },

  createLocation: function create(location, token, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/locations/',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({event}),
      dataType: 'json',
    }, callback);
  },

  editEvent: function (event, token, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.url + '/events/' + id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({}),
      dataType: 'json'
    }, callback);
  },

  // showEvent: function show(event, token, callback) {
  //   this.ajax({
  //     method: 'GET',
  //     url: this.url + '/events/' + id,
  //     headers: {
  //       Authorization: 'Token token=' + token
  //     },
  //     dataType: 'json'
  //   }, callback);
  // },

};


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

$('#list-events').on('submit', function(e) {
    var token = $('.token').val();
    e.preventDefault();
    api.listEvents(event, token, callback);
  });

// $('#show-event').on('submit', function(e) {
//     var eventData = {"event":
//       {
//         id: $('#show-eventId').val()
//       }
//     }
//     var token = $('.token').val();
//     e.preventDefault();
    // api.showEvent(event, token, callback);
  // });

  var createEventCB = function createEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }

    $('#eventId').val(data.event.id);
    callback(null, data);
  };

  var createLocationCB = function createLocationCB(err, data) {
    if(err) {
      callback(err);
      return;
    }

    $('#locationId').val(data.location.id);
    callback(null, data);
  };

  var listEventCB = function listEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }
    $('#eventId').val(data.event.id);
    callback(null, data);
  };

  var editEventCB = function editEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }
    $('#eventId').val(data.event.id);
    callback(null, data);
  };

  // var showEventCB = function showEventCB(err, data) {
  //   if(err) {
  //     callback(err);
  //     return;
  //   }

  //   $('#show-eventId').val(data.event.id);
  //   callback(null, data);
  // };

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

  $('#create-location').on('submit', function(e) {
    var location = {
      city: $('#city').val(),
      state: $('#state').val(),
      region: $('#region').val()
      }
    var token = $('.token').val();
    var id = location.id;
    e.preventDefault();
    api.createLocation(location, token, createLocationCB);

    });

  $('#edit-event').on('submit', function(e) {
    var eventData = {"event":
      {
        id: $('#event-id').val(),
        business_kind: $('#edit_business_kind').val(),
        name: $('#edit_name').val(),
        website: $('#edit_website').val(),
        phone_number: $('#edit_phone_number').val(),
        event_date: $('#edit_event_date').val(),
        group_size: $('#edit_group_size').val(),
        location_id: $('#edit_location_id').val()
      }
    }
    var token = $('.token').val();
    e.preventDefault();
    editEventCB();

    $.ajax({
      method: 'PATCH',
      url: api.url + '/events/' + eventData.event.id,
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(eventData),
      dataType: 'json'
    })
    .done(function(){
    console.log('updated this event!');
    });
    // api.editEvent(event, token, editEventCB);
  });

});
