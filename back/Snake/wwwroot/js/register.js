

$(document).ready(() => {
    $("#register-button").click(() => {
        if ($("#password").val() === $("#repassword").val()) {
            $("#register-form").submit();
        }
        else {
            $("#password-check").text("The passwords don't match!");
            $("#password-check").show();
        }
    });
});