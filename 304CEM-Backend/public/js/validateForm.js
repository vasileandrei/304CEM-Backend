
function showForm() {
    document.getElementById('formContainer').style.display = "block";
    document.getElementById('formButton').style.display = "none";

    document.getElementById("formName").required;
    document.getElementById("formEmail").required;
    document.getElementById("formPhone").required;
    document.getElementById("formSite").required;

    window.scrollTo(0, document.body.scrollHeight);
}

function validateForm() {

    var phoneValue = document.getElementById("formPhone").value;
    var phoneField = document.getElementById("formPhone");
    var contactForm = document.getElementById("contact");

    //Phone Number
    if (isNaN(phoneValue)) {
        phoneField.customError = false;
        phoneField.setCustomValidity('the phone number is wrong format');
        contactForm.reportValidity();
        return false;
    }
    // if (phoneValue.toString()[0] != 0 && phoneValue.toString()[1] != 0) {
    //     phoneField.customError = false;
    //     phoneField.setCustomValidity('the phone number must start with 00');
    //     contactForm.reportValidity();
    //     return false;
    // }
}