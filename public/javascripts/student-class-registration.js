function addToWishlist(button) {
    console.log("Running");
    // Get the class ID from the data-class-id attribute
    const classId = $(button).data('class-id');
  
    // Call the addToWishlist function with the class ID
    $.post('/register/wishlist', {classId: classId}, function(response) {
      // Display a message based on the response
      alert(response);
    });
}

function addToList(button) {
    console.log("Running");
    // Get the class ID from the data-class-id attribute
    const classId = $(button).data('class-id');
  
    // Call the addToListfunction with the class ID
    $.post('/register/add', { classId: classId }, function (response) {
      if (response === 'The class is full.') {
        const addToWait = confirm('The class is full. Do you want to add it to the waitlist?');
  
        if (addToWait) {
          addToWaitlist(classId);
        }
      } else {
        // Display a message based on the response
        alert(response);
        location.reload();
      }
    });
}

function addToWaitlist(classId) {
  $.post('/register/waitlist', { classId: classId }, function (response) {
    // Display a message based on the response
    alert(response);
    location.reload();
  });
}

function removeFromWishlist(button) {
  console.log("Running");
  // Get the class ID from the data-class-id attribute
  const classId = $(button).data('class-id');

  // Call the addToListfunction with the class ID
  $.post('/register/removewish', {classId: classId}, function(response) {
    // Display a message based on the response
    alert(response);
    location.reload();
  });
  
}