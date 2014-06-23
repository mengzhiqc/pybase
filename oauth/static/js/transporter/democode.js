$(document).ready(function(){
    var demoCode = new DemoCode();
    demoCode.run();
});

function DemoCode ()
{
    this.run = function() {
        bindEvent();
    }
}

function bindEvent() {
    $("#J_submit").on("click", function(){
        didClickSubmitButton($(this));
    });
}

function didClickSubmitButton(actionItem) {
    var data = {
        "order_id" : $("#J_orderId").val(),
        "name" : $("#J_name").val(),
        "phone" : $("#J_phone").val(),
        "code" : $("#J_code").val()
    }

    $.mobile.loading("show");

    var url = "/transporter/verifycode";
    $.post(url, data, function(returnData){
        $.mobile.loading("hide");
        if (returnData["status"] == "ok") {
            alert("OK!");
        } else {
            alert("订单号和验证码不对");
        }
    }, "json");
}

