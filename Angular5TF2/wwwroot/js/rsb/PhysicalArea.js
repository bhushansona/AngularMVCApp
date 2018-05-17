
$(document).ready(function () {
    $('#searchCriterias').hide();

    // ajax call to fetch the records of Physical Area
    $.ajax({
        url: "/replenishsupplybroker/api/AreaMappingData/GetAllPhysicalAreaMapping",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            // load filtered Physical Area Mapping data from logical area mapping screen (Sub-Grid row click)
            var physicalAreaId = JSON.parse(localStorage.getItem("physicalAreaId"));
            if (physicalAreaId != null) {
                var data = Enumerable.From(result.operations)
                    .Where("o => o.PhysicalAreaId == '" + physicalAreaId + "'")
                    .Select("o => o")
                    .ToArray();

                createDataTableForPhysicalArea(data);
                localStorage.removeItem("physicalAreaId");
            }
            else {
                createDataTableForPhysicalArea(result.operations);
            }
        },
        error: function (result) {
            toastr.error($.i18n.prop("Error Occurred", ''), '', {
                closeButton: true,
                progressBar: true,
                positionClass: "toast-top-center",
                timeOut: "2000",
            });
        }
    });
});

// Date Picker(Created Date) in Advance Search Modal Popup
$('#divCreatedDateFilter').datepicker({
    useCurrent: false,
    autoclose: true,
    todayHighlight: true,
});

// DateRange Picker(Created Date) in Advance Search Modal Popup
$('#dateRangeCreatedDate').daterangepicker();

// Date Picker(Modified Date) in Advance Search Modal Popup
$('#divModifiedDateFilter').datepicker({
    useCurrent: false,
    autoclose: true,
    todayHighlight: true,
});

// DateRange Picker(Modified Date) in Advance Search Modal Popup
$('#dateRangeModifiedDate').daterangepicker();

// Bootstrap DataTable of Physical Area Mapping
var createDataTableForPhysicalArea = function (result) {
    var table = $('#tblPhysicalAreaMapping').DataTable({
        "bDestroy": true,
        "data": result,
        "scrollY": "330px",
        "scrollX": true,
        "columns": [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            { "data": "PhysicalAreaName" },
            { "data": "CreatedBy" },
            { "data": "CreatedDateTime" },
            { "data": "ModifiedBy" },
            { "data": "ModifiedDateTime" }
        ],
        "order": [[1, 'asc']]
    });

    // Add event listener for opening and closing details (Sub-Grid) and binding data into it
    $('#tblPhysicalAreaMapping tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(physicalAreaFormat(row.data())).show();
            for (var i = 0; i < row.data().LogicalAreaModel.length; i++) {
                var markup = '<tr id=' + row.data().LogicalAreaModel[i].LogicalAreaId + ' onclick=logicalAreaDetails("' + row.data().LogicalAreaModel[i].LogicalAreaId + '")>' +
                    '<th style = background-color:white;></th > ' +
                    '<td><a href = #>' + row.data().LogicalAreaModel[i].LogicalAreaName + '</a></td>' +
                    '<td>' + row.data().LogicalAreaModel[i].CreatedBy + '</td>' +
                    '<td>' + row.data().LogicalAreaModel[i].CreatedDateTime + '</td>' +
                    '<td>' + row.data().LogicalAreaModel[i].ModifiedBy + '</td>' +
                    '<td>' + row.data().LogicalAreaModel[i].ModifiedDateTime + '</td>' +
                    '</tr>';

                $("#tblphysicalAreaSubgrid tbody").append(markup);
            }
            tr.addClass('shown');
        }
    });
    $('#tblPhysicalAreaMapping_filter').hide();
}

// Redirect to Logical Area Mapping details and load data by LogicalAreaId
var logicalAreaDetails = function (value) {
    if ($("#tblphysicalAreaSubgrid tbody tr").hasClass('table-subgrid-background-color')) {
        $("#tblphysicalAreaSubgrid tbody tr").removeClass('table-subgrid-background-color');
    }
    else {
        $('#' + value + '').attr('class', 'table-subgrid-background-color');
        localStorage.setItem("logicalAreaId", JSON.stringify(value));
        window.location.href = "/replenishsupplybroker/logicalArea"
    }
}

// Create Dynamic sub-grid table for Physical Area
function physicalAreaFormat(d) {
    return '<table id="tblphysicalAreaSubgrid" class="table table-bordered"> ' +
        '<thead>' +
        '<tr>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;"></th> ' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Logical Area</th>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Created By</th>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Created Date</th>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Modified By</th>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Modified Date</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>';
}

// Operands dropdown change event
$('#drpCreatedDateOperands').change(function () {
    if ($(this).val() === "4") {
        if ($(this).val() == "between") {
            $('#divCreatedDateFilter').hide();
            $('#dateRangeCreatedDate').removeAttr('style');
        }
        else {
            $('#divCreatedDateFilter').show();
            $('#dateRangeCreatedDate').attr('style', 'display:none;');
        }
    }
});

$('#drpModifiedDateOperands').change(function () {
    if ($(this).val() === "4") {
        if ($(this).val() == "between") {
            $('#divModifiedDateFilter').hide();
            $('#dateRangeModifiedDate').removeAttr('style');
        }
        else {
            $('#divModifiedDateFilter').show();
            $('#dateRangeModifiedDate').attr('style', 'display:none;');
        }
    }
});

// Bootstrap Modal Popup On Advance Search button click
$('#btnPhysicalAreaSearch').click(function () {
    filter(getSearchConditions());
});

function getSearchConditions() {
    var fromCreatedDate = '0001/1/1 00:00:00', toCreatedDate = '0001/1/1 00:00:00';
    var fromModifiedDate = '0001/1/1 00:00:00', toModifiedDate = '0001/1/1 00:00:00';

    if ($('#drpCreatedDateOperands').val() === "4") {
        fromCreatedDate = $('#dateRangeCreatedDate').val().split('-')[0].trim();
        toCreatedDate = $('#dateRangeCreatedDate').val().split('-')[1].trim();
    }
    else {
        fromCreatedDate = $('#txtCreatedDate').val();
        toCreatedDate = null;
    }

    if ($('#drpModifiedDateOperands').val() === "4") {
        fromModifiedDate = $('#dateRangeModifiedDate').val().split('-')[0].trim();
        toModifiedDate = $('#dateRangeModifiedDate').val().split('-')[1].trim();
    }
    else {
        fromModifiedDate = $('#txtModifiedDate').val();
        toModifiedDate = null;
    }

    var modalData = {
        "AreaNameFilter": $('#txtPhysicalAreaNameFilter').val(),
        "AreaNameOperand": $('#drpPhysicalAreaNameOperands option:selected').text(),
        "CreatedByFilter": $('#txtCreatedByFilter').val(),
        "CreatedByOperand": $('#drpCreatedByOperands option:selected').text(),
        "FromCreatedDateFilterString": fromCreatedDate,
        "ToCreatedDateFilterString": toCreatedDate,
        "CreatedDateOperand": $('#drpCreatedDateOperands option:selected').text(),
        "ModifiedByFilter": $('#txtModifiedByFilter').val(),
        "ModifiedByOperand": $('#drpModifiedByOperands option:selected').text(),
        "FromModifiedDateFilterString": fromModifiedDate,
        "ToModifiedDateFilterString": toModifiedDate,
        "ModifiedDateOperand": $('#drpModifiedDateOperands option:selected').text()
    };
    return modalData;
}

function removeFilter(id) {
    var cnt = parseInt(id);
    if (cnt === PhysicalAreaFilterEnum.createddate) {
        $('#drpCreatedDateOperands').val("0");
        $('#dateRangeCreatedDate').val("");
        $('#txtCreatedDate').val("");
        $('#divCreatedDateFilter').show();
        $('#dateRangeCreatedDate').attr('style', 'display:none;');
    }

    if (cnt === PhysicalAreaFilterEnum.modifieddate) {
        $('#drpModifiedDateOperands').val("0");
        $('#dateRangeModifiedDate').val("");
        $('#txtModifiedDate').val("");
        $('#divModifiedDateFilter').show();
        $('#dateRangeModifiedDate').attr('style', 'display:none;');
    }

    if (cnt === PhysicalAreaFilterEnum.areaname) {
        $('#drpPhysicalAreaNameOperands').val("0");
        $('#txtPhysicalAreaNameFilter').val("");
    }

    if (cnt === PhysicalAreaFilterEnum.createdby) {
        $('#drpCreatedByOperands').val("0");
        $('#txtCreatedByFilter').val("");
    }

    if (cnt === PhysicalAreaFilterEnum.modifiedby) {
        $('#drpModifiedByOperands').val("0");
        $('#txtModifiedByFilter').val("");
    }

    filter(getSearchConditions());
}

function filter(modalData) {
    $.ajax({
        url: "/replenishsupplybroker/api/PhysicalAreaData/GetFileteredPhysicalAreas",
        type: "POST",
        data: JSON.stringify(modalData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            createDataTableForPhysicalArea(result.operations);
            $('#PhysicalAreaFilterModal').modal('hide');
        },
        error: function (result) {
            toastr.error($.i18n.prop("Error Occurred", ''), '', {
                closeButton: true,
                progressBar: true,
                positionClass: "toast-top-center",
                timeOut: "2000"
            });
        },
        complete: addCriterias(modalData)
    });
}

function addCriterias(result) {
    var createdDate = "";
    var modifiedDate = "";
    var areaName = "";
    var createdBy = "";
    var modifiedBy = "";

    // area name
    if (!checkIfEmpty(result.AreaNameFilter) && result.AreaNameOperand !== "Operands") {
        areaName += result.AreaNameOperand + " " + result.AreaNameFilter;
    }

    //created by
    if (!checkIfEmpty(result.CreatedByFilter) && result.CreatedByOperand !== "Operands") {
        createdBy += result.CreatedByOperand + " " + result.CreatedByFilter;
    }

    //modified by
    if (!checkIfEmpty(result.ModifiedByFilter) && result.ModifiedByOperand !== "Operands") {
        modifiedBy += result.ModifiedByOperand + " " + result.ModifiedByFilter;
    }

    // created date
    if (!checkIfEmpty(result.ToCreatedDateFilterString) && result.CreatedDateOperand === "between") {
        createdDate += result.FromCreatedDateFilterString + " <> " + result.ToCreatedDateFilterString;
    } else if (!checkIfEmpty(result.FromCreatedDateFilterString) && result.CreatedDateOperand !== "Operands") {
        createdDate += result.CreatedDateOperand + " " + result.FromCreatedDateFilterString;
    }

    // modified date
    if (!checkIfEmpty(result.ToModifiedDateFilterString) && result.ModifiedDateOperand === "between") {
        modifiedDate += result.FromModifiedDateFilterString + " <> " + result.ToModifiedDateFilterString;
    } else if (!checkIfEmpty(result.FromModifiedDateFilterString) && result.ModifiedDateOperand !== "Operands") {
        modifiedDate += result.ModifiedDateOperand + " " + result.ToModifiedDateFilterString;
    }

    var script = searchCriteriaView(PhysicalAreaFilterEnum.areaname, areaName) +
        searchCriteriaView(PhysicalAreaFilterEnum.createdby, createdBy) +
        searchCriteriaView(PhysicalAreaFilterEnum.modifiedby, modifiedBy) +
        searchCriteriaView(PhysicalAreaFilterEnum.createddate, createdDate) +
        searchCriteriaView(PhysicalAreaFilterEnum.modifieddate, modifiedDate);

    if (script === "") {
        $('#searchCriterias').hide();
    } else {
        $('#searchCriterias').html("Filtered By: " + script);
        $('#searchCriterias').show();
    }
}

function searchCriteriaView(id, criteria) {
    if (criteria === "")
        return "";
    return '<div id=filter' + id + ' class="filterdiv">' +
        '<span class="filtertag">' + criteria + '</span> &nbsp' +
        '<a href="javascript:removeFilter(' + "'" + id + "'" + ')" class="filtertag-a"><i class="glyphicon glyphicon-remove-sign"></i></a>' +
        '</div>';
}

function checkIfEmpty(val) {
    return val === null || val === "";
}

var PhysicalAreaFilterEnum = {
    areaname: 1,
    createdby: 2,
    modifiedby: 3,
    createddate: 4,
    modifieddate: 5
};
