
$(document).ready(function () {
    $('#searchCriterias').hide();

    // ajax call to fetch the records of Logical Area
    $.ajax({
        url: "/replenishsupplybroker/api/AreaMappingData/GetAllLogicalAreaMapping",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            // load filtered Logical Area Mapping data from physical area mapping screen (Sub-Grid row click)
            var logicalAreaId = JSON.parse(localStorage.getItem("logicalAreaId"));
            if (logicalAreaId != null) {
                var data = Enumerable.From(result.operations)
                    .Where("o => o.LogicalAreaId == '" + logicalAreaId + "'")
                    .Select("o => o")
                    .ToArray();

                createDataTableForLogicalArea(data);
                localStorage.removeItem("logicalAreaId");
            }
            else {
                createDataTableForLogicalArea(result.operations);
            }
        },
        error: function (result) {
            toastr.error($.i18n.prop("Error Occurred", ''), '', {
                closeButton: true,
                progressBar: true,
                positionClass: "toast-top-center",
                timeOut: "2000"
            });
        }
    });
});

// Date Picker(Created Date) in Advance Search Modal Popup
$('#divCreatedDateFilter').datepicker({
    useCurrent: false,
    autoclose: true,
    todayHighlight: true
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

// Bootstrap DataTable of Logical Area Mapping
var createDataTableForLogicalArea = function (result) {
    var table = $('#tblLogicalAreaMapping').DataTable({
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
            { "data": "LogicalAreaName" },
            { "data": "CreatedBy" },
            { "data": "CreatedDateTime" },
            { "data": "ModifiedBy" },
            { "data": "ModifiedDateTime" }
        ],
        "order": [[1, 'asc']]
    });

    // Add event listener for opening and closing details (Sub-Grid) and binding data into it
    $('#tblLogicalAreaMapping tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(logicalAreaFormat(row.data())).show();
            for (var i = 0; i < row.data().PhysicalAreaModel.length; i++) {
                var markup = '<tr id=' + row.data().PhysicalAreaModel[i].PhysicalAreaId + ' onclick=physicalAreaDetails("' + row.data().PhysicalAreaModel[i].PhysicalAreaId + '")>' +
                    '<th style = background-color:white;></th > ' +
                    '<td><a href = #>' + row.data().PhysicalAreaModel[i].PhysicalAreaName + '</a></td>' +
                    '<td>' + row.data().PhysicalAreaModel[i].CreatedBy + '</td>' +
                    '<td>' + row.data().PhysicalAreaModel[i].CreatedDateTime + '</td>' +
                    '<td>' + row.data().PhysicalAreaModel[i].ModifiedBy + '</td>' +
                    '<td>' + row.data().PhysicalAreaModel[i].ModifiedDateTime + '</td>' +
                    '</tr>';

                $("#tbllogicalAreaSubgrid tbody").append(markup);
            }
            tr.addClass('shown');
        }
    });
    $('#tblLogicalAreaMapping_filter').hide();
};

// Redirect to Physical Area Mapping details and load data by PhysicalAreaId
var physicalAreaDetails = function (value) {
    if ($("#tbllogicalAreaSubgrid tbody tr").hasClass('table-subgrid-background-color')) {
        $("#tbllogicalAreaSubgrid tbody tr").removeClass('table-subgrid-background-color');
    }
    else {
        $('#' + value + '').attr('class', 'table-subgrid-background-color');
        localStorage.setItem("physicalAreaId", JSON.stringify(value));
        window.location.href = "/replenishsupplybroker/physicalArea"
    }
}

// Generate Sub-Grid data
function logicalAreaFormat(d) {
    return '<table id="tbllogicalAreaSubgrid" class="table table-bordered"> ' +
        '<thead>' +
        '<tr>' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;"></th> ' +
        '<th scope="col" style="background-color: white; border-bottom: 1px solid #ddd;;">Physical Area</th>' +
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
        $('#divCreatedDateFilter').hide();
        $('#dateRangeCreatedDate').removeAttr('style');
    }
    else {
        $('#divCreatedDateFilter').show();
        $('#dateRangeCreatedDate').attr('style', 'display:none;');
    }
});

$('#drpModifiedDateOperands').change(function () {
    if ($(this).val() === "4") {
        $('#divModifiedDateFilter').hide();
        $('#dateRangeModifiedDate').removeAttr('style');
    }
    else {
        $('#divModifiedDateFilter').show();
        $('#dateRangeModifiedDate').attr('style', 'display:none;');
    }
});

// Advanced Search : Logical area search by criterias
$('#btnLogicalAreaSearch').click(function () {
    filter(getSearchConditions());
});

function getSearchConditions() {
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

    var data = {
        "AreaNameFilter": $('#txtLogicalAreaNameFilter').val(),
        "AreaNameOperand": $('#drpLogicalAreaNameOperands option:selected').text(),
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
    return data;
}

function removeFilter(id) {
    var cnt = parseInt(id);
    if (cnt === LogicalAreaFilterEnum.createddate) {
        $('#drpCreatedDateOperands').val("0");
        $('#dateRangeCreatedDate').val("");
        $('#txtCreatedDate').val("");
        $('#divCreatedDateFilter').show();
        $('#dateRangeCreatedDate').attr('style', 'display:none;');
    }

    if (cnt === LogicalAreaFilterEnum.modifieddate) {
        $('#drpModifiedDateOperands').val("0");
        $('#dateRangeModifiedDate').val("");
        $('#txtModifiedDate').val("");
        $('#divModifiedDateFilter').show();
        $('#dateRangeModifiedDate').attr('style', 'display:none;');
    }

    if (cnt === LogicalAreaFilterEnum.areaname) {
        $('#drpLogicalAreaNameOperands').val("0");
        $('#txtLogicalAreaNameFilter').val("");
    }

    if (cnt === LogicalAreaFilterEnum.createdby) {
        $('#drpCreatedByOperands').val("0");
        $('#txtCreatedByFilter').val("");
    }

    if (cnt === LogicalAreaFilterEnum.createdby) {
        $('#drpModifiedByOperands').val("0");
        $('#txtModifiedByFilter').val("");
    }

    filter(getSearchConditions());
}

function filter(modalData) {
    $.ajax({
        url: "/replenishsupplybroker/api/LogicalAreaData/GetFileteredLogicalAreas",
        type: "POST",
        data: JSON.stringify(modalData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            createDataTableForLogicalArea(result.operations);
            $('#LogicalAreaFilterModal').modal('hide');
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

    var script = searchCriteriaView(LogicalAreaFilterEnum.areaname, areaName) +
        searchCriteriaView(LogicalAreaFilterEnum.createdby, createdBy) +
        searchCriteriaView(LogicalAreaFilterEnum.modifiedby, modifiedBy) +
        searchCriteriaView(LogicalAreaFilterEnum.createddate, createdDate) +
        searchCriteriaView(LogicalAreaFilterEnum.modifieddate, modifiedDate);

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

var LogicalAreaFilterEnum = {
    areaname: 1,
    createdby: 2,
    modifiedby: 3,
    createddate: 4,
    modifieddate: 5
};

$('#btnLogicalAreaBack').click(function () {
    window.location.href = "/replenishsupplybroker/PhysicalArea"
});