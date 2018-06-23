
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function ValidateFileUpload() {

var fuData = document.getElementById('fileChooser');
var FileUploadPath = fuData.value;

if (FileUploadPath == '') {
    alert("Please upload an image");
    return false ;

} else {
    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
     var MAX_SIZE = 300000 ;


    if (Extension == "gif" || Extension == "png" || Extension == "bmp"
                || Extension == "jpeg" || Extension == "jpg") {


            if (fuData.files && fuData.files[0]) {

                var size = fuData.files[0].size;

                if(size > MAX_SIZE){
                    alert("Maximum file size exceeds");
                    return false;
                }else{
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        $('#blah').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(fuData.files[0]);
                }
            }

    } 
  else {
        alert("Photo only allows file types of GIF, PNG, JPG, JPEG and BMP. ");
        return false ;
    }
}
return true ;
}

function validatepf(){
    var pfno = document.forms["pnbcardform"]["pf_no"] ;
    if((pfno.value.length != 5 && pfno.value.length != 6) || pfno.value == "" || !pfno.value.match(/^\d+$/) ){
         pfno.style.color = "red" ;
         pfno.value = " please enter 5 or 6 digit pf number"  ; 
         
    }
    else{
        pfno.style.color = "black" ;
        document.getElementById('moreinfo').style.display = "block" ;
        document.getElementById('val').style.display = "none" ;
       document.getElementById('htextforpf').value = pfno.value ;
       pfno.disabled = "true" ;
    }
}
function validatepffocus(){
    var pfno = document.forms["pnbcardform"]["pf_no"] ;
    if(pfno.style.color == "red" ) pfno.style.color = "grey" ;
    if(pfno.value = " please enter 5 or 6 digit pf number") pfno.value = "" ;
}

function validation(){
	var pfno = document.forms["pnbcardform"]["pf_no"] ;
	var date = document.forms["pnbcardform"]["date_"];
	var br_info = document.forms["pnbcardform"]["br_info"];
	var f_name = document.forms["pnbcardform"]["f_name"];
	var f_namehin = document.forms["pnbcardform"]["f_namehin"];
	var bgrp = document.forms["pnbcardform"]["bgrp"];
	var desig = document.forms["pnbcardform"]["desig"];
	var dob = document.forms["pnbcardform"]["dob"];
	var mob_no = document.forms["pnbcardform"]["mob_no"];
	var pfno = document.forms["pnbcardform"]["pf_no"];
	var address = document.forms["pnbcardform"]["address"];
	var email = document.forms["pnbcardform"]["email"];
	var pan = document.forms["pnbcardform"]["pan"];
    
	if((pfno.value.length != 5 && pfno.value.length != 6) || pfno.value == ""){
		console.log(pfno.value.length) ;
         window.alert("Please enter a valid PF number");
         pfno.focus();
        return false;
	}
	if(f_name.value.length > 30 || f_name.value == ""){
       window.alert("Enter a valid name");
        f_name.focus();
        return false;
	}

	if(address.value == "" || address.value.length > 125){
		 window.alert("Invalid address");
        address.focus();
        return false;
	}
    if(email.value != "" && !validateEmail(email.value) ){
    	window.alert("Invalid email. Please check the entered email");
        email.focus();
        return false;
    }
    if(mob_no.value == "" || mob_no.value.length <10){
    	window.alert("Invalid mobile number") ;
        mob_no.focus();
        return false;
    }
    if(!ValidateFileUpload()) return false ;
    return true ;

}