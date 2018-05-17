
// Added for multi-language support
$(".dropdown-item").click(function () {
    var selectedOption = $(this).find("img").attr("alt");
});

$('#btnTest').click(function () {
    $.ajax({
        url: "https://team5-vanderlande.eastus.cloudapp.azure.com/api/ReplenishSupplyBroker/SendSupplyGroupDefinedEvent",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.isSuccess);
        },
        error: function (result) {
            
        }
    });
});