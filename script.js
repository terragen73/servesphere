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
let isAdded=false;

function setDocument(collectionName, docId, data) {
    return firestore.collection(collectionName).doc(docId).set(data)
        .then(() => {
            console.log('Document written successfully');
        })
        .catch((error) => {
            console.error('Error writing document: ', error);
        });
}

function addQuestion() {
    isAdded=true;
    if(isAdded)
    {
        document.getElementById("add").innerText="ADD ANOTHER QUESTION"
    }
    const questionContainer = document.getElementById("question-container");

    // Create a div to hold the question and its options
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    // Create input field for the question
    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Enter question text here";
    questionInput.classList.add("question-input");

    // Create a container for options
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    // Button to add an option to the question
    const addOptionButton = document.createElement("button");
    addOptionButton.innerText = "ADD OPTION";
    addOptionButton.classList.add("add-option-button");
    addOptionButton.onclick = function () {
        addOption(optionsContainer);
    };

    // Append elements to the questionDiv
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(optionsContainer);
    questionDiv.appendChild(addOptionButton);

    // Append the questionDiv to the main container
    questionContainer.appendChild(questionDiv);
}

// Function to add a new option to a specific question
function addOption(optionsContainer) {
    const optionGroup = document.createElement("div");
    optionGroup.classList.add("option-group");

    // Create input field for the option
    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.placeholder = "Enter option text here";
    optionInput.classList.add("option-input");

    // Create a button to remove the option
    const removeOptionButton = document.createElement("button");
    removeOptionButton.innerText = "REMOVE";
    removeOptionButton.classList.add("remove-option-button");
    removeOptionButton.onclick = function () {
        optionsContainer.removeChild(optionGroup);
    };

    // Append the input and button to the option group
    optionGroup.appendChild(optionInput);
    optionGroup.appendChild(removeOptionButton);

    // Append the option group to the options container
    optionsContainer.appendChild(optionGroup);
}
let formattedDate;
// Function to handle form submission
function handleSubmit() {
    const questionContainer = document.getElementById("question-container");
    let formHTML = "<form>\n";

    const questions = questionContainer.querySelectorAll(".question");
    questions.forEach((question, index) => {
        const questionText = question.querySelector(".question-input").value;

        formHTML += `  <fieldset>\n`;
        formHTML += `    <legend>Question ${index + 1}</legend>\n`;
        formHTML += `    <label>${questionText}</label>\n`;

        const options = question.querySelectorAll(".option-group input[type='text']");
        options.forEach((option, optIndex) => {
            formHTML += `    <input type="radio" name="question${index + 1}" value="${option.value}"> ${option.value}<br>\n`;
        });

        formHTML += `  </fieldset>\n`;
    });
    formHTML += `<input type="submit" id="formSubmit" onClick="getFormDetails()">`
    formHTML += "</form>";

    console.log(formHTML); // Output the generated HTML form structure to the console
    var date = new Date();


    formattedDate = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') + // Add 1 for the month and pad to 2 digits
        String(date.getDate()).padStart(2, '0') + // Pad day to 2 digits
        date.getTime(); // Get the time in milliseconds since January 1, 1970

    console.log(formattedDate);
    if(isAdded)
    {

        setDocument(`company/${sessionStorage.getItem("username")}/forms/`, formattedDate, {
            content: formHTML
        }).then(() => {
            console.log('Doct created:');
             openModal();
        });
    }else{
        alert("Add atleast one question and there options!")
    }

}

// Adding a submit button
 



function openModal() {
   
    document.getElementById("qr_img").setAttribute("src",`https://quickchart.io/qr?text=${formattedDate}&dark=f00&light=0ff&ecLevel=Q&format=png`)
    document.getElementById("qr_img_down").setAttribute("href",`https://quickchart.io/qr?text=${formattedDate}&dark=f00&light=0ff&ecLevel=Q&format=png`)
    document.getElementById("qrModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("qrModal").style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.onclick = function (event) {
    const modal = document.getElementById("qrModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.onload=()=>{
    if(!sessionStorage.getItem("username"))
    {
        window.location.href="sign_in.html"
    }
}
