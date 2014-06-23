// add order js file

$(document).ready(function(){

    if ( $('#orderId').length == 0 ){//如果有id，表明是编辑，则不执行下面逻辑
        $('#goodsCategory').bind('change',function(){
            var weightCategoryMap = [1,1,2,1,2];
            var selectedCategory = $(this).children('option:selected').val()-1;
            var weightInputBox = $('#goodsWeight');
            weightInputBox.val(weightCategoryMap[selectedCategory]);
        });
    }
});