$('document').ready(function(){

    $('#register-form').validate({
        rules: {
            name: {
                required:true,
                maxlength:20,
                minlength:3
            },
            email: {
                required:true,
                email: true
            },
            password: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            confirm_password: {
                required: true,
                equalTo: '#password'
            },
        },
        submitHandler: submitForm
    });

    $("#institution").click(function(){
        if(!$("#institution").val()){
            $.ajax({
                type : 'GET',
                url  : 'http://localhost:8080/selectBoxes/institutions',
                contentType: "application/json",
                success :  function(result)
                {
                    var htmlCode
                    console.log(result);
                    for(var i=0; i<result.length; i++){
                        htmlCode += '<option value="'+result[i].id+'">'+result[i].description+'</option>'
                    }
                    $("#institution").html(htmlCode); 
                },
                error : function(e) {
                    console.log("ERROR: ", e);
                }
            });
        }
    })

    /* form submit */
    function submitForm(){
        var selector = document.getElementById('institution');
        var value = selector[selector.selectedIndex].value;
        var objDTO = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            institutionId: value,
            email: $("#email").val(),
            password: $("#password").val(),
        }

        $.ajax({
            type : 'POST',
            url  : 'http://localhost:8080/students',
            contentType: "application/json",
            data : JSON.stringify(objDTO),
            success :  function(result){
                console.log(result);
                resetData();
                return true;
            },
            error : function(e) {
                console.log("ERROR: ", e);

                for(var i=0; i<e.responseJSON.errors.length; i++) {
                    if(e.responseJSON.errors[i].field == "email"){
                        $("#email").val(e.responseJSON.errors[i].defaultMessage)
                    }
                }
            }
        });
        return false;
    }
    /* form submit */

    function resetData(){
        $("#name").val("");
        $("#phone").val("");
        $('#institution').prop('selectedIndex', 0);
        $("#email").val("");
        $("#password").val("");
        $("#confirm_password").val("");
    }

})
