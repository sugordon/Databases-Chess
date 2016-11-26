'use strict';

$("#box1").on('keyup', function (e) {
  if (e.keyCode == 13) {
    var value = $( this ).val();
    console.log("box1" + value);
    var data = { value: value };
    $.get( "api/search", data, function(data) {
      console.log(data);
    }, 'json');
  }
});

$( "#box2" )
  .keyup(function() {
    var value2 = $( this ).val();
    console.log("box2 " + value2);
  })
  .keyup();
