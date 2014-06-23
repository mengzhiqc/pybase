$(document).ready(function(){
    //点击下一步，搜集表单信息
    $('#orderNextButton').bind('click',function(){
        $.mobile.loading("show");
        var order = {};
        order.supplierName = $('#supplier').val();
        order.supplierPhone = $('#phone').val();
        order.supplierAddress = $('#supplierAddress').val();
        order.orderValue = parseInt($('#orderValue').val());
        order.isPrePay = ($('#isPrePay').is(":checked"))?1:2;
        order.receiverName = $('#receiver').val();
        order.receiverPhone = $('#receiverPhone').val();
        order.receiverAddress = $('#receiverAddress').val();
        order.goodsCategory = $('#goodsCategory option:selected').val();
        order.goodsWeight =  parseFloat($('#goodsWeight').val());

        var day = $('#expectFetchTimeDay option:selected').val();
        var hour = $('#expectFetchTimeHour option:selected').val();
        var miniute = $('#expectFetchTimeMiniute option:selected').val();
        var today = new Date()
        var stringDate = today.getFullYear()+"/"+(today.getMonth()+1)+"/"+today.getDate()+" "+hour+":"+miniute;
        var expectTime = new Date(stringDate)
        order.expectTime = (day == 1)?(expectTime.getTime()/1000):(expectTime.getTime()/1000+3600*24);
        order.orderInfo = $('#orderInfo').val();
        order.actionType = $(this).attr('isEdit');

        if (order.expectTime < Date.parse(new Date())/1000) {
            alert("取货时间不能选择过去的时间");
            $.mobile.loading("hide");
            return;
        }

        if (order.receiverAddress == order.supplierAddress) {
            alert("收货地址不能与发货地址相同");
            $.mobile.loading("hide");
            return;
        }

        if (order.goodsWeight <= 0) {
            alert("重量必须大于0");
            $.mobile.loading("hide");
            return;
        }

        if (order.orderValue <= 0) {
            alert("商品价格必须大于0");
            $.mobile.loading("hide");
            return;
        }

        if (isNaN(order.orderValue)) {
            alert("商品价格必须是个数字");
            $.mobile.loading("hide");
            return;
        }

        if (isNaN(order.goodsWeight)) {
            alert("重量必须是个数字");
            $.mobile.loading("hide");
            return;
        }

        if (isNaN(order.supplierPhone) || order.supplierPhone.length < 8) {
            alert("商家手机号格式错误");
            $.mobile.loading("hide");
            return;
        }

        if (isNaN(order.receiverPhone) || order.receiverPhone.length < 8) {
            alert("收货人手机号格式错误");
            $.mobile.loading("hide");
            return;
        }

        if(order.actionType == 1){
            order.orderId = $('#orderId').val();
            order.supplierId = $('#supplierId').val();
        }
        var params = JSON.stringify(order);
        if (validateParams(params)) {
            // 从这里以后就会是一连串的ajax，直到提交
            checkReceiveAddressAvailable(params);
        } else {
            alert("请将订单填写完整");
            $.mobile.loading("hide");
        }
    });

    //增加 减少费用
    $('#deliverFee .left-button').bind('click',function(){
        var minFee = $('#minFee').val();
        var nowFee = parseInt($('#deliverFee .middle-button').eq(0).html());
        if (nowFee <= minFee) {
            alert("不能小于最低费用");
        } else {
            var nextFee = nowFee - 2;
            var nextFeeString = nextFee.toString() + "元";
            if (nextFee < minFee) {
                $('#deliverFee .middle-button').eq(0).addClass('ui-state-disabled');
            }
        }
        $('#deliverFee .middle-button').eq(0).html(nextFeeString);
    });

    $('#deliverFee .right-button').bind('click',function(){
        var nowFee = parseInt($('#deliverFee .middle-button').eq(0).html());
        var nextFee = nowFee + 2;
        var nextFeeString = nextFee.toString() + "元";

        $('#deliverFee .middle-button').eq(0).html(nextFeeString);
    });

    //确认发布页面
    $('#submit').bind('click',function(){
        var nowFee = parseInt($('#deliverFee .middle-button').eq(0).html());
        //todo 判断不能低于下限
        var orderId = $('#orderIdHidden').val();
        var url = $('#orderSubmitUrlHidden').val();
        var redirectUrl = $('#orderSubmitUrlSuccess').val();
        var params = {deliverFee:nowFee}
        $.post(url,params,function(response){
            if(response.status=='ok'){
                window.location.href= redirectUrl;
            }
        },'json');
    });

    //取消订单
    $('#select_cancel_reason a').bind('click',function(){
        $(this).parent().siblings().find('span').removeClass('ui-icon-selected');
        $(this).children('span').addClass('ui-icon-selected');
    });

    $('#cancelOrderSubmit').bind('click',function(){
        var spans = $('#select_cancel_reason span');
        var selectedSpanValue ='';

        for (var i=0; i<spans.length; i++){
            if ($(spans[i]).hasClass('ui-icon-selected')) {
                selectedSpanValue = $(spans[i]).attr('value');
            }
        }

        
        var url = $(this).attr('targetUrl');
        if (selectedSpanValue != '') {
            $.post(url,{cancelReason:selectedSpanValue},function(res){
                if (res.status=='ok') {
                    window.location.href='/';
                };
            },'json');
        }
    });

});

function validateParams(params) {
    result = true;
    checkParams = JSON.parse(params);
    $.each(checkParams, function(index, value){
        if (index == "orderInfo") {
            return;
        }
        if (value.length == 0) {
            result = false;
        }
    });
    return result;
}

function checkReceiveAddressAvailable (params) {
    var city = "021";
    var address = JSON.parse(params).receiverAddress;;
    var url = "/common/geo/getCoordinator/"+city+"/"+address;
    $.getJSON(url, function(data){
        if (data["status"] == "ok") {
            checkSupplierAddressAvailable(params);
        } else {
            alert("请准确填写收货人地址，如张扬路1000号302室");
            $.mobile.loading("hide");
        }
    });
}

function checkSupplierAddressAvailable (params) {
    var city = "021";
    var address = JSON.parse(params).supplierAddress;;
    var url = "/common/geo/getCoordinator/"+city+"/"+address;
    $.getJSON(url, function(data){
        if (data["status"] == "ok") {
            goAddOrder(params);
        } else {
            alert("请准确填写店面地址，如张扬路1000号302室");
            $.mobile.loading("hide");
        }
    });
}

function goAddOrder(params) {
    var url = $('#orderAddForm').attr('action');
    $.post(url, {'params':params}, function(response){
        if(response.status=='ok' && response.results > 0){
            window.location.href="/order/detail/"+response.results;
        }
    },'json');
}
