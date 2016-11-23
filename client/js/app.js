'use strict';
$( "#box1" )
  .keyup(function() {
    var value = $( this ).val();
    console.log("box1" + value);
  })
  .keyup();
  
 $( "#box2" )
  .keyup(function() {
    var value2 = $( this ).val();
    console.log("box2 " + value2);
  })
  .keyup();