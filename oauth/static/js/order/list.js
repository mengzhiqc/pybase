$(document).ready(function(){
    var orderList = new OrderList();
    orderList.run();
});

$(document).on("pageinit", function(){
    // safari下会有奇怪的事情发生
    $.mobile.loading("hide");
});

function OrderList()
{
    this.run = function() {
        bindEvent();
        initPage();
    }

    function initPage() {
        var dataStatus = $("#J_dataContainer").attr("data-status");
        $(".J_selectButton[data-status="+dataStatus+"]").trigger("click");
    }

    function bindEvent() {
        $(".J_selectButton").on("click", function(){
            didClickSelectButton($(this));
        });
        $("#J_nextPage").on("click", function(){
            didClickPageButton($(this));
        });
        $("#J_previousPage").on("click", function(){
            didClickPageButton($(this));
        });
        $(".J_deleteOrder").on("click", function(){
            didCilckDeleteOrder($(this));
        });
    }

    function didCilckDeleteOrder(actionItem) {
        $.mobile.loading("show");
        var url = "/order/del/" + actionItem.attr("data-order-id");
        $.post(url,function(){
            $.mobile.loading("hide");
            $("li[data-order-id="+actionItem.attr("data-order-id")+"]").hide("slow");
        });
    }

    function didClickPageButton(actionItem) {
        var orderStatus = $("#J_dataContainer").attr("data-status");
        var pageNumber = actionItem.attr("data-npn");
        loadContent(orderStatus, pageNumber);
    }

    function didClickSelectButton(actionItem) {
        var orderStatus = actionItem.attr("data-status");
        $.each($(".J_selectButton"), function(index, value){
            if ($(value).attr("data-status") != orderStatus) {
                $(value).removeClass("active");
            }
        });
        actionItem.addClass("active");

        $("#J_indicator").attr("data-tpn", "1");
        loadContent(orderStatus, 1);

        $("#J_dataContainer").attr("data-status", orderStatus);
    }
}

function loadContent(orderStatus, pageNumber) {
    var tpn = parseInt($("#J_indicator").attr("data-tpn"));
    pageNumber = parseInt(pageNumber);
    if (pageNumber == 0 || pageNumber > tpn) {
        return;
    }

    $.mobile.loading("show");

    var url = "/order/listContent/" + orderStatus + "/" + pageNumber;
    $("#J_orderList").load(url, function(){

        $.mobile.loading("hide")
        $(this).listview('refresh')

        var tpn = parseInt($(".J_listItem:first").attr("data-total-page-count"));
        if (tpn == 0) {
            $("#J_nextPage").attr("data-npn", 0);
            $("#J_previousPage").attr("data-npn", 0);
            $("#J_indicator").attr("data-cpn", 1);
            $("#J_indicator").attr("data-tpn", 0);
            $("#J_indicator").html(0+"/"+0);
        } else {
            $("#J_nextPage").attr("data-npn", parseInt(pageNumber)+1);
            $("#J_previousPage").attr("data-npn", parseInt(pageNumber)-1);
            $("#J_indicator").attr("data-cpn", pageNumber);
            $("#J_indicator").attr("data-tpn", tpn);
            $("#J_indicator").html(pageNumber+"/"+tpn);
        }
    });
}
