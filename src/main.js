"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sortablejs_1 = require("sortablejs");
// get elements from HTML
var userInput = document.getElementById("userInput");
var productAmount = document.getElementById("productAmount");
var productMetric = document.getElementById("productMetric");
var addButton = document.getElementById("addButton");
var todoList = document.getElementById("todolist");
var exportButton = document.getElementById("export");
var totalDiv = document.getElementById("total");
var totalPriceSpan = document.getElementById("total-price");
var uploadButton = document.getElementById("upload");
var uploadFileInput = document.getElementById("uploadFile");
var deleteButton = document.getElementById("delete-all");
var totalPrice = 0;
var toDoCounter = 0;
var supermarketProducts = {
    Appels: {
        id: 1,
        name: "Appels",
        category: "Fruit",
        pricePerPiece: 0.5,
        pricePerKg: 2.49,
        inStock: true,
    },
    Bananen: {
        id: 2,
        name: "Bananen",
        category: "Fruit",
        pricePerPiece: 0.3,
        pricePerKg: 1.99,
        inStock: true,
    },
    Kipfilet: {
        id: 3,
        name: "Kipfilet",
        category: "Meat",
        pricePerPiece: 4.5,
        pricePerKg: 8.99,
        inStock: true,
    },
    Rijst: {
        id: 4,
        name: "Rijst",
        category: "Grains",
        pricePerPiece: null,
        pricePerKg: 1.5,
        inStock: true,
    },
    Brood: {
        id: 5,
        name: "Brood",
        category: "Bakery",
        pricePerPiece: 1,
        pricePerKg: null,
        inStock: true,
    },
};
var getPrice = function () {
    var productValue = userInput.value;
    var amountValue = productAmount.value;
    var metricValue = productMetric.value;
    var cardPrice = 0;
    if (supermarketProducts.hasOwnProperty(productValue)) {
        var selectedProduct = supermarketProducts[productValue];
        if (metricValue === "kg" && selectedProduct.pricePerKg) {
            var pricePerKg = selectedProduct.pricePerKg;
            cardPrice = pricePerKg * Number(amountValue);
            totalPrice += cardPrice;
            console.log("Price per kg for ".concat(productValue, ": \u20AC").concat(pricePerKg));
            console.log("Total price is now \u20AC".concat(totalPrice.toFixed(2)));
            console.log("CardPrice is now \u20AC".concat(cardPrice.toFixed(2)));
            return cardPrice;
        }
        else if (metricValue === "stuks" && selectedProduct.pricePerPiece) {
            var pricePerPiece = selectedProduct.pricePerPiece;
            var cardPrice_1 = pricePerPiece * Number(amountValue);
            totalPrice += cardPrice_1;
            return cardPrice_1;
        }
    }
    return cardPrice;
};
function generateId(baseId) {
    toDoCounter++;
    console.log(toDoCounter);
    return baseId + "_" + toDoCounter;
}
//functionaliteit
var createTaskCard = function () {
    var productValue = userInput.value;
    var amountValue = productAmount.value;
    var metricValue = productMetric.value;
    var cardPrice = getPrice();
    if (!amountValue) {
        alert("Vul een hoeveelheid in!");
        return;
    }
    // Creeer de html elementen voor een todo-item in memory
    //div
    var taskItem = document.createElement("div");
    taskItem.classList.add("todo-item");
    //input
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = generateId("todo-item");
    console.log("testing variable", checkbox.id);
    checkbox.classList.add("item");
    //label
    var label = document.createElement("label");
    label.setAttribute("for", checkbox.id);
    label.classList.add("todoLabel");
    label.innerText = "".concat(productValue, ", ").concat(amountValue, " ").concat(metricValue);
    //pricetag
    var priceTag = document.createElement("span");
    priceTag.textContent = "\u20AC ".concat(cardPrice);
    priceTag.classList.add("price");
    //deletebutton
    var deleteButton = document.createElement("span");
    deleteButton.classList.add("material-symbols-outlined");
    deleteButton.innerText = "close";
    //juiste structuur maken in memory
    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);
    taskItem.appendChild(priceTag);
    taskItem.appendChild(deleteButton);
    //toevoegen van memory naar screen
    todoList.appendChild(taskItem);
    totalDiv.style.display = "flex";
    productAmount.value = "";
    totalPriceSpan.textContent = "Totaal: \u20AC".concat(totalPrice.toFixed(2));
    console.log(todoList.innerHTML);
    //event listener toevoegen voor delete knop - captures taskItem from function scope
    deleteButton.addEventListener("click", function () {
        taskItem.remove();
        console.log("prijs check", totalPrice, cardPrice);
        totalPrice -= cardPrice;
        totalPriceSpan.textContent = "Totaal: \u20AC".concat(totalPrice.toFixed(2));
        if (!todoList.hasChildNodes()) {
            totalDiv.style.display = "none";
            toDoCounter = 0;
        }
    });
};
//export functionaliteit
var exportToJSON = function () {
    var tasks = [];
    var todoItems = todoList.querySelectorAll(".todo-item");
    // check of todoItems leeg is
    if (todoItems.length === 0) {
        alert("Geen todo-items om te exporteren!");
        return;
    }
    todoItems.forEach(function (el) {
        var _a, _b;
        var label = (_a = el.querySelector(".todoLabel")) === null || _a === void 0 ? void 0 : _a.innerText;
        var _c = label ? label.split(", ") : ["", ""], task = _c[0], amountAndMetric = _c[1]; // Handle potential null values - label tekst splitten op ", " en creëer daar 2 variabelen voor met destructuring assignment over elke Node
        var _d = amountAndMetric
            ? amountAndMetric.split(" ")
            : ["", ""], amount = _d[0], metric = _d[1]; // hetzelfde voor amount en metric
        var price = (_b = el.querySelector(".price")) === null || _b === void 0 ? void 0 : _b.innerText;
        tasks.push({
            task: task,
            amount: amount,
            metric: metric,
            price: price,
        });
    });
    // converteer array naar JSON (array, replacer function, indentation)
    var jsonString = JSON.stringify(tasks, null, 2);
    // BLOB = binary large object - pass array met de JSON string en geef aan dat het om JSON gaat
    var blob = new Blob([jsonString], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    // creeer een element in memory en click het element - met dot notation voeg je attributen href en download toe aan html element.
    var a = document.createElement("a");
    a.href = url;
    a.download = "todolist.json";
    a.click();
    // verwijderd url uit memory
    URL.revokeObjectURL(url);
};
var loadTasksFromJSON = function (tasks) {
    tasks.forEach(function (task) {
        userInput.value = task.task;
        productAmount.value = task.amount;
        productMetric.value = task.metric;
        createTaskCard();
    });
};
// event listeners
addButton.addEventListener("click", function () {
    createTaskCard();
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});
exportButton.addEventListener("click", function () {
    exportToJSON();
});
userInput.addEventListener("change", function () {
    var selectedOption = userInput.value;
    productMetric.innerHTML = "\n    <option value=\"stuks\">stuks</option>\n    <option value=\"kg\">kg</option>\n  ";
    if (supermarketProducts.hasOwnProperty(selectedOption)) {
        var selectedProduct = supermarketProducts[selectedOption];
        if (selectedProduct.pricePerKg === null) {
            var kgOption = productMetric.querySelector('option[value="kg"]');
            if (kgOption) {
                kgOption.remove();
            }
        }
        if (selectedProduct.pricePerPiece === null) {
            var pieceOption = productMetric.querySelector('option[value="stuks"]');
            if (pieceOption) {
                pieceOption.remove();
            }
        }
    }
});
window.addEventListener("load", function () {
    var mainContainer = document.getElementById("container");
    mainContainer.className = "animate-up";
});
uploadButton.addEventListener("click", function () {
    uploadFileInput.click();
});
uploadFileInput.addEventListener("change", function (event) {
    var input = event.target;
    var file = input.files ? input.files[0] : null; // Access the first file (should be only one)
    if (file) {
        var reader = new FileReader(); // Create a new FileReader to read the file contents
        // Define what happens when the file is successfully read
        reader.onload = function (e) {
            var _a;
            var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result; // Get the file content
            try {
                var tasks = JSON.parse(content); // Parse the JSON content into an array of tasks
                loadTasksFromJSON(tasks); // Call a function to populate the tasks in the to-do list
            }
            catch (error) {
                console.error("Invalid JSON file:", error); // Handle error if JSON is invalid
                alert("The uploaded file is not valid JSON!");
            }
        };
        reader.readAsText(file); // Read the file as a plain text (which should be JSON)
    }
});
deleteButton.addEventListener("click", function () {
    if (window.confirm("Weet je zeker dat je alle boodschappen wilt verwijderen?")) {
        todoList.innerHTML = "";
        totalPrice = 0;
        toDoCounter = 0;
        totalDiv.style.display = "none";
    }
});
var sortable = new sortablejs_1.default(todoList, {
    animation: 150,
    ghostClass: "dragging",
    onStart: function (evt) {
        document.body.style.cursor = "grabbing";
    },
    onEnd: function (event) {
        document.body.style.cursor = "";
        console.log("Dragged item from", event.oldIndex, "to", event.newIndex);
    },
});
