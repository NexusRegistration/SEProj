// Waits for page to fully load 
document.addEventListener("DOMContentLoaded", function() {
    // Wait for the document to be ready
    $(document).ready(function() {
        $('#building').change(function() {
        const building = $(this).val();
        if (building === '') {
            $.ajax({
                url: '/add-classes/all-rooms',
                success: function(rooms) {
                    const $roomNameSelect = $('#room');
                    $roomNameSelect.empty();
                    $roomNameSelect.append($('<option>', {
                        value: "",
                        text: "Select a Room"
                    })),
                    rooms.forEach(function(room) {
                        $roomNameSelect.append($('<option>', {
                            value: room._id,
                            text: room.building + "-" + room.number + " (Capacity: " + room.capacity +  ")"
                        }));
                    });
                }
            });
        } else {
            $.ajax({
                url: '/add-classes/rooms',
                data: { building },
                success: function(rooms) {
                    const $roomNameSelect = $('#room');
                    $roomNameSelect.empty();
                    $roomNameSelect.append($('<option>', {
                        value: "",
                        text: "Select a Room"
                    })),
                    rooms.forEach(function(room) {
                        $roomNameSelect.append($('<option>', {
                            value: room._id,
                            text: room.building + "-" + room.number + " (Capacity: " + room.capacity +  ")"
                        }));
                    });
                }
            });
        }
        });
    });
});
