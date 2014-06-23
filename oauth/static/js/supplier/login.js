$(document).ready(function(){
    var supplierLogin = new SupplierLogin();
    supplierLogin.run();
});

function SupplierLogin()
{
    this.run = function() {
        before();
        bindEvent();
    };

    function before() {
        $("#J_username").val(getCookie("un"));
    }

    function bindEvent() {
        $("#J_submit").on("tap", function(){
            didClickedSubmitButton($(this));
        });
        $(document).keydown(function(event){
            if (event.which == 13) {
                $("#J_submit").trigger("tap");
            }
        });
    }

    function didClickedSubmitButton(actionItem) {
        result = checkAvailable({});
        if (result["status"]) {
            $.mobile.loading("show");
            var username = $("#J_username").val();
            var password = $("#J_password").val();
            request = $.post("/supplier/verify", {username:username, password:password}, function(result){
                $.mobile.loading("hide");
                if (result["status"] == "ok") {
                    setCookie("un", username, 1);
                    window.location.href=result["msg"];
                } else {
                    alert(result["msg"]);
                }
            }, 'json');
        } else {
            alert(result["error_object"].attr("placeholder"))
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
