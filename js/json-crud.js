$("#battleForm").submit(function(e) {
    e.preventDefault();

    var inputData = $('form#battleForm').serializeObject();
    console.log(inputData);

    d3.json("/data/all_battles_new.json", function(error, datas) {

        var data = datas;
        data.push(inputData);

        for (let i = 0; i < data.length; i++) {
            data[i].id = "id" + i;

            if (typeof data[i].geometry.coordinates[0] === 'string' ||
                typeof data[i].geometry.coordinates[1] === 'string' ||
                typeof data[i].properties.deaths === 'string' ||
                typeof data[i].properties.date === 'string') {

                data[i].geometry.coordinates[0] = Number(data[i].geometry.coordinates[0]);
                data[i].geometry.coordinates[1] = Number(data[i].geometry.coordinates[1]);
                data[i].properties.deaths = Number(data[i].properties.deaths);
                data[i].properties.date = Number(data[i].properties.date);
            }
        }

        console.log("New", data);

        saveToFile(data);
    });
});

function saveToFile(data) {
    var jsonString = JSON.stringify(data);
    var inputForm = document.getElementById('battleForm');
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            alert("New record has been added");
            inputForm.reset();
        }
    });
}

$(document).ready(function() {
    d3.json("/data/all_battles_new.json", function(error, data) {
        if (error) throw error;

        for (var i in data) {
            var listItem = "<a id=" + data[i].id + " class='list-group-item flex-column align-items-start'>" +
                "<div class='d-flex w-100 justify-content-between'>" +
                "<button data-target='#col" + data[i].id + "' data-toggle='collapse' role='button' aria-expanded='false' aria-controls='col" + data[i].id + "'>" + data[i].properties.name + "</button>" +
                "<small>" +
                "<button><i class='fas fa-edit'></i></button>" +
                "<button onclick=deleteItem($(this).closest('a').attr('id'))><i class='fas fa-times-circle'></i></button>" +
                "</small></div></a>"

            var collapse = "<div class='collapse' id='col" + data[i].id + "'>" +
                "<div class='card card-body'> " +
                "<p>Name: " + data[i].properties.name + "</p>" +
                "<p>Date: " + data[i].properties.date + "</p>" +
                "</div> </div>";

            $('#battles-list .list-group').append(listItem + collapse);
        }
    });
});

function deleteItem(itemId) {
    var confirmRes = confirm("Sure?");
    if (confirmRes) {
        d3.json("/data/all_battles_new.json", function(error, data) {
            if (error) throw error;

            console.log(itemId);

            var filtered = data.filter(function(item) {
                return item.id !== itemId;
            });

            console.log(filtered);

            saveDeleted(filtered);
        });
    }
}

function saveDeleted(data) {
    var jsonString = JSON.stringify(data);
    $.ajax({
        url: 'php/save.php',
        data: {
            'jsonString': jsonString
        },
        type: 'POST',
        success: function() {
            if (!alert('Item has been deleted successfully')) { window.location.reload(); }
        }
    });
}