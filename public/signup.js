document.getElementById('signUpForm').addEventListener('submit',(event)=>{
    event.preventDefault()
})

function gotoLogin(){
    location.replace("index.html")
}

function signUp(){
    const name =  document.getElementById("name").value
    const email =  document.getElementById("email").value
    const password =  document.getElementById("password").value
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        // var user = userCredential.user;
        userCredential.user.updateProfile({
            displayName: name
        })
        alert("Successfully Registered!\n Please login now!")
        // console.log("cred",userCredential.user)
    })
    .catch((error)=>{
        document.getElementById('msg').innerHTML = error.message
    })
}