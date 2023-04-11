function addToWishlist(button) {
    console.log("Running");
    // Get the class ID from the data-class-id attribute
    const classId = $(button).data('class-id');
  
    // Call the addToWishlist function with the class ID
    $.post('/register/wishlist', {classId: classId}, function(response) {
      // Display a message based on the response
      alert(response.message);
    });
}

function addToList(button) {
    console.log("Running");
    // Get the class ID from the data-class-id attribute
    const classId = $(button).data('class-id');
  
    // Call the addToListfunction with the class ID
    $.post('/register/add', {classId: classId}, function(response) {
      // Display a message based on the response
      alert(response);
      location.reload();
    });
    
}