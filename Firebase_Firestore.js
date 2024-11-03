const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-app-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  };
  
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  console.log(firestore);
  
  // Function to create a document and return the document reference
  function setDocument(collectionName, docId, data) {
    return firestore.collection(collectionName).doc(docId).set(data)
      .then(() => {
        console.log('Document written successfully');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
  
  // Function to get a document by ID and return the document data
  function getDocument(collectionName, docId) {
    return firestore.collection(collectionName).doc(docId).get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          throw new Error('No such document!');
        }
      });
  }
  
  // Function to get all documents in a collection and return an array of data objects
  function getAllDocuments(collectionName) {
    return firestore.collection(collectionName).get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map(doc => doc.data());
      });
  }
  
  // Function to update a document and return the updated document data
  function updateDocument(collectionName, docId, data) {
    return firestore.collection(collectionName).doc(docId).update(data)
      .then(() => {
        return getDocument(collectionName, docId); // Get the updated document data
      });
  }
  
  // Function to delete a document and return a confirmation message
  function deleteDocument(collectionName, docId) {
    return firestore.collection(collectionName).doc(docId).delete()
      .then(() => {
        return 'Document deleted successfully';
      });
  }
  
  