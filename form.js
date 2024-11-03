const firebaseConfig = {
    apiKey: "AIzaSyApl5-gq5HsM0WX6vqso2po2fIoLr6q108",
    authDomain: "servesphere-463e1.firebaseapp.com",
    projectId: "servesphere-463e1",
    storageBucket: "servesphere-463e1.firebasestorage.app",
    messagingSenderId: "362741020270",
    appId: "1:362741020270:web:3189fa648b73043d84587f"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
console.log(firestore);
let currentUrl = window.location.search;
function getDocument(collectionName, docId) {
    return firestore.collection(collectionName).doc(docId).get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
           alert("form has closed or invalid url");
        }
      });
  }

getDocument(`company/${sessionStorage.getItem("username")}/forms/`, currentUrl.substring(5))
.then((data) => {
 
let form=data.content;
 
document.getElementById("sample").innerHTML=form;
})
.catch((error) => {
console.error('Error getting document:', error);
});

function getFormDetails() {
    const form = document.querySelector("form");
    const formData = {};
  
    // Loop through all elements in the form
    Array.from(form.elements).forEach(element => {
      if (element.type === "radio" && element.checked) {
        formData[element.name] = element.value;
      }
    });
  
    console.log("Form Data:", formData);
  }
  
  console.log(currentUrl.substring(5));
  