function checkAvailable(callbacks) {
    var checkUniq = callbacks["checkUniq"];
    var success = callbacks["success"];
    var fail = callbacks["fail"];

    checkResult = checkRequired();
    if (!checkResult["status"]) {
        fail && fail(checkResult);
        return checkResult;
    }

    checkResult = checkSame();
    if (!checkResult["status"]) {
        fail && fail(checkResult);
        return checkResult;
    }

    checkResult = {"status":true};
    if (checkUniq) {
        $.each($(".J_uniq"), function(index, value){
            if (checkResult["status"]) {
                result = checkUniq($(value));
            }
        });
    }

    if (checkResult["status"]) {
        success && success();
    }

    return checkResult;
}

function checkRequired() {
    result = {"status":true};

    $.each($(".J_required"), function(index, value) {
        if (result["status"] == false) {
            return;
        }

        if (!$(value).val() || $(value).val() == "") {
            result["status"] = false;
            result["error_object"] = $(value);
            result["type"] = "required";
            return result;
        }
    });

    return result;
}

function checkSame() {
    result = {"status":true, "error_related_objects":[]};

    $.each($(".J_same"), function(index, value){
        // TODO
    });

    return result;
}
