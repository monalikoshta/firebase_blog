db = firebase.firestore()

document.getElementById('addPost').addEventListener('submit',(event)=>{
    event.preventDefault()
})

firebase.auth().onAuthStateChanged((user)=>{
    if(!user){
        location.replace("./index.html")
    }
    else{
        document.getElementById("userEmail").innerHTML = "Hello " + user.displayName
    }
})


function logout(){
    firebase.auth().signOut()
}

function addPost(){
    const title = document.getElementById('title').value
    const content = document.getElementById('content').value
    const file = document.getElementById('file').files[0]
    if(title && content && file){
        const imageName = file.name
        const storageRef = firebase.storage().ref('images/'+ imageName)
        uploadTask = storageRef.put(file)

        uploadTask.on('state_changed', (snapshot)=>{
            var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log('upload is '+ progress +'% done')
        },(error)=>{
            console.log(error.message)
        },()=>{
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
                db.collection('posts').add({
                    title: title,
                    content: content,
                    imageUrl: downloadURL,
                    userid: firebase.auth().currentUser.uid,
                    author: firebase.auth().currentUser.displayName,
                    createdAt: Date.now()
                }).then((docRef) => {
                    alert("Success!")
                    location.reload()
                })
                .catch((error) => {
                    alert("Error!")
                });
            })
        })
    }
    else{
        alert("Fields marked with * are complusory!")
    }
}

function displayPosts(){
    db.collection("posts").orderBy("createdAt","desc").get().then((querySnapshot) => {
        cards=''
        querySnapshot.forEach((doc) => {
            // console.log(doc.data().userid);
            cards += '<div class="col-sm-4 mt-2 mb-1">'+
                '<div class="card">'+
                '<img class="card-img-top" src=" '+doc.data().imageUrl+' " alt="Card image cap">'+
                '<div class="card-body">'+
                    '<h5 class="card-title">'+doc.data().title+'</h5>'+
                    '<h6 class="text-right">-'+doc.data().author+'</h6>'+
                    '<p class="card-text">'+doc.data().content+'</p>'+
                '</div></div></div>'
        });
        document.getElementById('posts').innerHTML = cards
    });
}
displayPosts()

function myBlogs(){
    db.collection("posts").where("userid", "==", firebase.auth().currentUser.uid).orderBy("createdAt","desc").get()
    .then((querySnapshot) => {
        cards=''
        querySnapshot.forEach((doc) => {
            cards += '<div class="col-sm-4 mt-2 mb-1">'+
                '<div class="card">'+
                '<img class="card-img-top" src=" '+doc.data().imageUrl+' " alt="Card image cap">'+
                '<div class="card-body">'+
                    '<h5 class="card-title">'+doc.data().title+'</h5>'+
                    '<h6 class="text-right">-'+doc.data().author+'</h6>'+
                    '<p class="card-text">'+doc.data().content+'</p>'+
                    '<button id="'+ doc.id +'"class="btn btn-danger" onClick="deletePost(this.id)">Delete</button>'+
                '</div></div></div>'
        });
        document.getElementById('posts').innerHTML = cards
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function deletePost(postId){
    db.collection("posts").doc(postId).delete().then(() => {
        alert("Successfully deleted!");
        location.reload()
    }).catch((error) => {
        alert("Error removing document: ", error);
    });
}