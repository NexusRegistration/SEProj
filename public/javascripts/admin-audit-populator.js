document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        $('form').submit(function(event) {
            //console.log("Triggered");
            event.preventDefault();
            console.log("Sending AJAX Request")
            $.ajax({
                url: '/search-audits/audits',
                type: 'GET',
                data: $('form').serialize(),
                success: function(response) {
                    console.log(response)
                    console.log("Success Callback Triggered");
                    $('#auditEntry-container').empty();
                    if (response != null && response.length > 1) {
                        console.log("Response > 0")
                        $('#auditEntry-container').append(response);
                    } else {
                        console.log("Response < 0")
                        alert("No Changes Fit this Criteria \n Change Search Parameters");
                        //$('#auditEntry-container').append('No Changes Fit this Criteria. Change Search Parameters.');
                    } 
                },
                error: function(xhr, status, error) {
                    console.log("Error Callback Triggered")
                    $('#auditEntry-container').empty();
                    $('#auditEntry-container').append('<div id="error-message">Error: ' + error + '</div>');
                }
            });
        });
        $('#class-fields').hide();
        $('#auditType').on('change', function() {
            var selectedOption = $(this).find(':selected').val();
            
            // if the selected option contains the word 'class', show the fields
            if (selectedOption.includes('class')) {
              $('#class-fields').show();
              $('#class-fields :input').prop('disabled', false);
            } else {
              // otherwise, hide the fields
              $('#class-fields').hide();
              $('#class-fields :input').prop('disabled', true);
            }
          });
    });
});