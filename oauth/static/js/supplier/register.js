$(document).ready(function(){
    var supplierRegister = new SupplierRegister();
    supplierRegister.run();
});

function SupplierRegister()
{
    this.run = function() {
        bindEvent();
    };

    function bindEvent() {
        $("#J_nextStep").on("tap", function() {
            didTapNextStepButton($(this));
        });
        $("#J_area").on("change", function(){
            didChangeArea($(this));
        });
    }

    function didChangeArea(actionItem) {
        $.mobile.loading("show");
        $("#J_block").html('<option value="" selected="selected">所在商圈</option>');
        $("#J_block").change();
        var url = "/common/blockListWithAreaId/" + actionItem.val();
        var request = $.ajax({
            type:"GET",
            url:url,
            async:true,
            dataType:"json"
        });
        request.done(function(data){
            if (data["status"] == "ok") {
                $.each(data["result"], function(index, value){
                    $("#J_block").append('<option value="'+value.id+'">'+value.name+'</option>');
                });
                $.mobile.loading("hide");
            }
        });
    }

    function didTapNextStepButton(actionItem) {
        var params = {
                username:$("#J_username").val(),
                password:$("#J_password").val(),
                password2:$("#J_password2").val(),
                name:$("#J_name").val(),
                area:$("#J_area").val(),
                block:$("#J_block").val(),
                address:$("#J_address").val(),
                contactName:$("#J_contactName").val(),
                contactMobile:$("#J_contactMobile").val(),
                phone:$("#J_phone").val()
             }

        if (params.password != params.password2) {
            alert("输入的密码不一致");
            return;
        }

        if (params.phone.length != 11) {
            alert("输入的手机号格式不对");
            return;
        }

        checkAvailable({
            "checkUniq":function(checkItem, fail){
                            $.mobile.loading("show");
                            var url = "/supplier/isUsernameAvailable/" + checkItem.val();
                            $.getJSON(url, function(result){
                                if (result["status"] == 'ok') {
                                    checkLatlng("021", params.address, params);
                                    return true;
                                } else {
                                    alert("用户名已经存在");
                                    $.mobile.loading("hide");
                                    return false;
                                }
                            });
                        },
            "fail":function(result){
                alert(result["error_object"].attr("data-"+result["type"]+"-msg"));
            }
        });
    }
}

function checkLatlng(city, address, params){
    var url = "/common/geo/getCoordinator/"+city+"/"+address;
    $.getJSON(url, function(data){
        if (data["status"] == "ok") {
            params["lat"] = data["lat"];
            params["lng"] = data["lng"];
            addSupplier(params);
        } else {
            alert("请填写正确格式的地址");
            $.mobile.loading("hide");
        }
    });
}

function addSupplier(params){
    $.ajax({
        type:"POST",
        url:"/supplier/add",
        async:true,
        data:params,
        dataType:"json"
    }).done(function(msg){
        if (msg['status'] == 'ok') {
            $.mobile.loading("hide");
            window.location.href='/';
        }
    });
}
