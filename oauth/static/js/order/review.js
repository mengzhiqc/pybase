$(document).ready(function(){
    var orderReview = new OrderReview();
    orderReview.run();
});

function OrderReview()
{
    this.run = function(){
        bindEvent();
    };

    function bindEvent(){
        $(".J_reviewButton").on("click", function(){
            didClickButton($(this));
        });
        $("#J_submit").on("click", function(){
            didClickSubmitButton($(this));
        });
    }

    function didClickButton(actionItem) {
        $("#J_submit").attr("data-is-good", actionItem.attr("data-review"));
        $.each($(".J_reviewButton"), function(index, value){
            $(value).removeClass("ui-custom-btn1");
        });
        actionItem.addClass("ui-custom-btn1");
    }

    function didClickSubmitButton(actionItem) {
        $.mobile.loading("show");
        data = {
            "isGood":actionItem.attr("data-is-good"),
            "textReview":$("#J_textReview").val()
        };
        if (parseInt(data["isGood"]) == 0) {
            $.mobile.loading("hide");
            alert("请选择好或不好");
            return;
        }
        var url = "/order/addReview/" + actionItem.attr("data-order-id");
        $.post(url, data, function(){
            $.mobile.loading("hide");
            window.location.href = "/";
        });
    }
}
