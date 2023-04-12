function openEditPage(button) {
    console.log("Opening Edit Page");
    // Get the class ID from the data-class-id attribute
    const class_Id = $(button).data('class-id');
  
    // Call the addToWaitlist function with the class ID
    window.location.href = '/admin/class-edit?class_ID=' + class_Id;
  }