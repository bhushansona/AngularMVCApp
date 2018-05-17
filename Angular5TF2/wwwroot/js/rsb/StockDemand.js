$(document).ready(function () {
    $('#searchCriterias').hide();
    var dateFromat = "DD/MM/YYYY HH:mm:ss";
    // OnLoad: ajax call to fetch the Stock Demand Records
    var stockRecords; // Fillerd with Stock Demand Records On Load
    $.ajax({
        url: "/replenishsupplybroker/api/StockDemandData/GetStockDemandReocrds",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            stockRecords = result.stockDemandRecords;
            createDataTableForStockDemandRecords(stockRecords);
        },
        error: function () {
            toastr.error("Error Occurred", '', {
                closeButton: true,
                progressBar: true,
                positionClass: "toast-top-center",
                timeOut: "2000"
            });
        }
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

    // Date Picker(RequiredFinish Date) in Advance Search Modal Popup
    $('#dateRequiredFinishDateTime').datepicker({
        useCurrent: false,
        autoclose: true,
        todayHighlight: true,
    });

    // DateRange Picker(Modified Date) in Advance Search Modal Popup
    $('#dateRangeRequiredFinishDateTime').daterangepicker();


    // Bootstrap DataTable of Stock Demand Records
    var createDataTableForStockDemandRecords = function (result) {
        $("#tblStockDemandRecords").DataTable({
            "bDestroy": true,
            "data": result,
            "searching": false,
            "scrollY": "330px",
            "scrollX": true,
            "columns": [
                { "title": "Sku Variant", "data": "SkuVariant" },
                { "title": "Target Physical Area", "data": "TargetPhysicalArea" },
                { "title": "Amount", "data": "Amount" },
                { "title": "TSU Type", "data": "TsuType" },
                { "title": "Stock Demand Group", "data": "StockDemandGroup" },
                {
                    "title": "Required Finish DateTime",
                    "data": "RequiredFinishDateTime",
                    "render": function (data) { return (data) ? moment(data).format(dateFromat) : data; }
                },
                { "title": "Created By", "data": "CreatedBy" },
                {
                    "title": "Created DateTime",
                    "data": "CreatedDateTime",
                    "render": function (data) { return (data) ? moment(data).format(dateFromat) : data; }
                },
                { "title": "Modified By", "data": "ModifiedBy" },
                {
                    "title": "Modified DateTime",
                    "data": "ModifiedDateTime",
                    "render": function (data) { return (data) ? moment(data).format(dateFromat) : data; }
                }
            ],
            "order": [[1, "asc"]]
        });
    };

    // Operands dropdown change event
    $('#drpCreatedDateTimeDateOperands').change(function () {
        if ($(this).val() == "between") {
            $('#divCreatedDateFilter').hide();
            $('#dateRangeCreatedDate').removeAttr('style');
        }
        else {
            $('#divCreatedDateFilter').show();
            $('#dateRangeCreatedDate').attr('style', 'display:none;');
        }
    });

    $('#drpModifiedDateTimeDateOperands').change(function () {
        if ($(this).val() == "between") {
            $('#divModifiedDateFilter').hide();
            $('#dateRangeModifiedDate').removeAttr('style');
        }
        else {
            $('#divModifiedDateFilter').show();
            $('#dateRangeModifiedDate').attr('style', 'display:none;');
        }
    });

    $('#drpRequiredFinishDateTimeDateOperands').change(function () {
        if ($(this).val() == "between") {
            $('#dateRequiredFinishDateTime').hide();
            $('#dateRangeRequiredFinishDateTime').removeAttr('style');
        }
        else {
            $('#dateRequiredFinishDateTime').show();
            $('#dateRangeRequiredFinishDateTime').attr('style', 'display:none;');
        }
    });

    // Advanced Search : filter Stock Demand Records present
    $("#btnStockDemandRecordSearch").click(function () {
        filter(getSearchConditions());
    });

    function getSearchConditions() {
        var fromCreatedDate = '0001/1/1 00:00:00', toCreatedDate = '0001/1/1 00:00:00';
        var fromModifiedDate = '0001/1/1 00:00:00', toModifiedDate = '0001/1/1 00:00:00';

        if ($('#drpCreatedDateTimeDateOperands').val() === "4") {
            fromCreatedDate = $('#dateRangeCreatedDate').val().split('-')[0].trim();
            toCreatedDate = $('#dateRangeCreatedDate').val().split('-')[1].trim();
        }
        else {
            fromCreatedDate = $('#txtCreatedDate').val();
            toCreatedDate = null;
        }

        if ($('#drpModifiedDateTimeDateOperands').val() === "4") {
            fromModifiedDate = $('#dateRangeModifiedDate').val().split('-')[0].trim();
            toModifiedDate = $('#dateRangeModifiedDate').val().split('-')[1].trim();
        }
        else {
            fromModifiedDate = $('#txtModifiedDate').val();
            toModifiedDate = null;
        }

        if ($('#drpRequiredFinishDateTimeDateOperands').val() === "4") {
            fromRequiredFinishDate = $('#dateRangeModifiedDate').val().split('-')[0].trim();
            toRequiredFinishDate = $('#dateRangeModifiedDate').val().split('-')[1].trim();
        }
        else {
            fromRequiredFinishDate = $('#txtRequiredFinishDateTime').val();
            toRequiredFinishDate = null;
        }

        var modalData = {
            "SkuVariant": $("#txtSkuVariant").val(),
            "SkuVariantOperand": $('#drpSkuvariantOperands option:selected').text(),

            "TargetPhysicalArea": $("#txtTargetPhysicalArea").val(),
            "TargetPhysicalAreaOperand": $('#drpTargetphysicalareaOperands option:selected').text(),

            "Amount": $("#txtAmount").val(),
            "AmountOperand": $('#drpAmountOperands option:selected').text(),

            "StockDemandGroup": $("#txtStockDemandGroup").val(),
            "StockDemandGroupOperand": $('#drpStockdemandgroupOperands option:selected').text(),

            "TSUType": $("#txtTsuType").val(),
            "TSUTypeOperand": $('#drpTsutypeOperands option:selected').text(),

            "CreatedByFilter": $('#txtCreatedBy').val(),
            "CreatedByOperand": $('#drpCreatedByOperands option:selected').text(),

            "ModifiedByFilter": $('#txtModifiedBy').val(),
            "ModifiedByOperand": $('#drpModifiedByOperands option:selected').text(),

            "CreatedDateOperand": $('#drpCreatedDateTimeDateOperands option:selected').text(),
            "FromCreatedDateFilterString": fromCreatedDate,
            "ToCreatedDateFilterString": toCreatedDate,

            "ModifiedDateOperand": $('#drpModifiedDateTimeDateOperands option:selected').text(),
            "FromModifiedDateFilterString": fromModifiedDate,
            "ToModifiedDateFilterString": toModifiedDate,

            "RequiredFinishDateTimeOperand": $('#drpRequiredFinishDateTimeDateOperands option:selected').text(),
            "FromRequiredFinishDateTimeFilterString": fromRequiredFinishDate,
            "ToRequiredFinishDateTimeFilterString": toRequiredFinishDate,

            "stockDemandRecords": stockRecords
        };
        return modalData;
    }

    function removeFilter(id) {
        var cnt = parseInt(id);
        if (cnt === StockDemandFilterEnum.CreatedDate) {
            $('#drpCreatedDateTimeDateOperands').val("0");
            $('#dateRangeCreatedDate').val("");
            $('#txtCreatedDate').val("");
            $('#divCreatedDateFilter').show();
            $('#dateRangeCreatedDate').attr('style', 'display:none;');
        }

        if (cnt === StockDemandFilterEnum.ModifiedDate) {
            $('#drpModifiedDateTimeDateOperands').val("0");
            $('#dateRangeModifiedDate').val("");
            $('#txtModifiedDate').val("");
            $('#divModifiedDateFilter').show();
            $('#dateRangeModifiedDate').attr('style', 'display:none;');
        }

        if (cnt === StockDemandFilterEnum.RequiredFinishDate) {
            $('#drpRequiredFinishDateTimeDateOperands').val("0");
            $('#dateRangeRequiredFinishDateTime').val("");
            $('#txtRequiredFinishDateTime').val("");
            $('#divRequiredFinishDateTime').show();
            $('#dateRangeRequiredFinishDateTime').attr('style', 'display:none;');
        }

        if (cnt === StockDemandFilterEnum.SkuVariant) {
            $('#drpSkuvariantOperands').val("0");
            $('#txtSkuVariant').val("");
        }

        if (cnt === StockDemandFilterEnum.TargetPhysicalArea) {
            $('#drpTargetphysicalareaOperands').val("0");
            $('#txtTargetPhysicalArea').val("");
        }

        if (cnt === StockDemandFilterEnum.Amount) {
            $('#drpAmountOperands').val("0");
            $('#txtAmount').val("");
        }

        if (cnt === StockDemandFilterEnum.StockDemandGroup) {
            $('#drpStockdemandgroupOperands').val("0");
            $('#txtStockDemandGroup').val("");
        }

        if (cnt === StockDemandFilterEnum.CreatedBy) {
            $('#drpCreatedByOperands').val("0");
            $('#txtCreatedBy').val("");
        }

        if (cnt === StockDemandFilterEnum.ModifiedBy) {
            $('#drpModifiedByOperands').val("0");
            $('#txtModifiedBy').val("");
        }

        filter(getSearchConditions());
    }

    function filter(modalData) {
        $.ajax({
            url: "/replenishsupplybroker/api/StockDemandData/GetSearchedStockDemandReocrds",
            type: "POST",
            data: JSON.stringify(modalData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                createDataTableForStockDemandRecords(result.FilteredStockDemandRecords);
                $("#StockDemandRecordsFilterModal").modal("hide");
            },
            error: function () {
                toastr.error($.i18n.prop("Error Occurred", ""), "", {
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
        var skuvariant = "";
        var targetphysicalarea = "";
        var createdBy = "";
        var modifiedBy = "";
        var amount = "";
        var stockdemandgroup = "";
        var tsutype = "";
        var requiredFinishDate = "";

        // sku variant
        if (!checkIfEmpty(result.SkuVariant) && result.SkuVariantOperand !== "Operands") {
            skuvariant += result.SkuVariantOperand + " " + result.SkuVariant;
        }

        // target physical area
        if (!checkIfEmpty(result.TargetPhysicalArea) && result.TargetPhysicalAreaOperand !== "Operands") {
            targetphysicalarea += result.TargetPhysicalAreaOperand + " " + result.TargetPhysicalArea;
        }

        // amount
        if (!checkIfEmpty(result.Amount) && result.AmountOperand !== "Operands") {
            amount += result.AmountOperand + " " + result.Amount;
        }

        // stock demand group
        if (!checkIfEmpty(result.StockDemandGroup) && result.StockDemandGroupOperand !== "Operands") {
            stockdemandgroup += result.StockDemandGroupOperand + " " + result.StockDemandGroup;
        }

        // TSU type
        if (!checkIfEmpty(result.TSUType) && result.TSUTypeOperand !== "Operands") {
            tsutype += result.TSUTypeOperand + " " + result.TSUType;
        }

        // created by
        if (!checkIfEmpty(result.CreatedBy) && result.CreatedByOperand !== "Operands") {
            createdBy += result.CreatedByOperand + " " + result.CreatedBy;
        }

        // modified by
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

        // required finish date
        if (!checkIfEmpty(result.ToRequiredFinishDateTimeFilterString) && result.RequiredFinishDateTimeOperand === "between") {
            requiredFinishDate += result.FromRequiredFinishDateTimeFilterString + " <> " + result.ToRequiredFinishDateTimeFilterString;
        } else if (!checkIfEmpty(result.FromRequiredFinishDateTimeFilterString) && result.RequiredFinishDateTimeOperand !== "Operands") {
            requiredFinishDate += result.RequiredFinishDateTimeOperand + " " + result.ToRequiredFinishDateTimeFilterString;
        }

        var script = searchCriteriaView(StockDemandFilterEnum.SkuVariant, skuvariant) +
            searchCriteriaView(StockDemandFilterEnum.TargetPhysicalArea, targetphysicalarea) +
            searchCriteriaView(StockDemandFilterEnum.Amount, amount) +
            searchCriteriaView(StockDemandFilterEnum.StockDemandGroup, stockdemandgroup) +
            searchCriteriaView(StockDemandFilterEnum.TSUType, tsutype) +
            searchCriteriaView(StockDemandFilterEnum.CreatedBy, createdBy) +
            searchCriteriaView(StockDemandFilterEnum.ModifiedBy, modifiedBy) +
            searchCriteriaView(StockDemandFilterEnum.ModifiedDate, modifiedDate) +
            searchCriteriaView(StockDemandFilterEnum.RequiredFinishDate, requiredFinishDate);

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

    var StockDemandFilterEnum = {
        SkuVariant: 1,
        TargetPhysicalArea: 2,
        Amount: 3,
        StockDemandGroup: 4,
        TSUType: 5,
        CreatedBy: 6,
        CreatedDate: 7,
        ModifiedBy: 8,
        ModifiedDate: 9,
        RequiredFinishDate: 10
    };

    // Global Search applied for Stock Demand records
    $("#btnSearchboxSearch").click(function () {
        var modalData = {
            "SearchString": $("#txtSearchbox").val(),
            "stockDemandRecords": stockRecords
        };

        $.ajax({
            url: "/replenishsupplybroker/api/StockDemandData/GetMatchingStockDemandReocrds",
            type: "POST",
            data: JSON.stringify(modalData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.FilteredStockDemandRecords && result.FilteredStockDemandRecords != null)
                    createDataTableForStockDemandRecords(result.FilteredStockDemandRecords);
                $("#StockDemandRecordsFilterModal").modal("hide");
            },
            error: function () {
                toastr.error($.i18n.prop("Error Occurred", ""), "", {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-top-center",
                    timeOut: "2000"
                });
            }
        });
    });
});

