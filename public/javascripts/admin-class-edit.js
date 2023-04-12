document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {

    });
});

function openSubjectEditing(button) {
    const classID = $(button).data('class-id');
    const subjectID = $(button).data('subject-id');
    $.get('/edit-classes/edit-subject', {subjectID, classID}, function(partialHtml) {
        $('#editing-container').empty().append(partialHtml);
    });   
}

function deleteSubject(button) {
    const confirmed = confirm("Are you sure you want to delete this subject? This will cause all classes associated with this subject to be deleted as well.")
    if (confirmed) {
        const subjectID = $(button).data('subject-id');
        $.post('/edit-classes/delete-subject', {subjectID})
    } 
}