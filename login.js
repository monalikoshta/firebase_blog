document.getElementById('loginForm').addEventListener('submit',(event)=>{
    event.preventDefault()
})

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        location.replace("blog_page.html")
    }
})

function login(){
    const email =  document.getElementById("email").value
    const password =  document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error)=>{
        document.getElementById('msg').innerHTML = error.message
    })
}

function gotoSignUp(){
    location.replace("signup.html")
}



function loginWithGoogle(){
    console.log("with google")
    var provider = new firebase.auth.GoogleAuthProvider();
    // console.log(provider)
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult()
    .then((result) => {
        if (result.credential) {
        /* @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // ...
        }
        // The signed-in user info.
        var user = result.user;
        console.log(user)
    }).catch((error) => {
        document.getElementById('msg').innerHTML = error.message
    });
    
}
