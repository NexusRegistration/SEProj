document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {

    });
});

function deleteClass(button) {
    const confirmed = confirm("Are you sure you want to delete this Class?")
    if (confirmed) {
        const classID = $(button).data('class-id');
        $.post('/edit-classes/delete', {classID}, (res) => {
            window.location.href = '/admin/classes';
        })
    }
}


function openRoomEditing(button) {
    const classID = $(button).data('class-id');
    const roomID = document.getElementById("room").value;
    console.log("RoomID: ", roomID);
    $.get('/edit-classes/edit-room-capacity', {roomID, classID}, function(partialHtml) {
        $('#editing-container').empty().append(partialHtml);
    });   
}

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
        $.post('/edit-classes/delete-subject', {subjectID}, (res) => {
            window.location.href = '/admin/classes';
        })
    } 
}



