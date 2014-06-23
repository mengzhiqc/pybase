$(document).on('pageinit', function(){
    var fillDetail = new FillDetail();
    fillDetail.run();
});

function FillDetail()
{
    this.run = function () {
        bindEvent();
    }

    function bindEvent() {
        alert("here i am");
    }
}
