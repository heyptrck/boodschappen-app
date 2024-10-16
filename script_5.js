// get elements from HTML
const userInput = document.getElementById("userInput");
const productAmount = document.getElementById("productAmount");
const productMetric = document.getElementById("productMetric");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todolist");
const exportButton = document.getElementById("export");
const totalDiv = document.getElementById("total");
const totalPriceSpan = document.getElementById("total-price");
let priceArr = [];
let totalPrice = 0;
let toDoCounter = 0;

//prijsdata
const supermarketProducts = {
  Appels: {
    name: "Appels",
    category: "Fruit",
    pricePerPiece: 0.5,
    pricePerKg: 2.49,
    inStock: true,
  },
  Bananen: {
    name: "Bananen",
    category: "Fruit",
    pricePerPiece: 0.3,
    pricePerKg: 1.99,
    inStock: true,
  },
  Kipfilet: {
    name: "Kipfilet",
    category: "Meat",
    pricePerPiece: 4.5,
    pricePerKg: 8.99,
    inStock: true,
  },
  Rijst: {
    name: "Rijst",
    category: "Grains",
    pricePerPiece: 1,
    pricePerKg: 1.5,
    inStock: true,
  },
  Brood: {
    name: "Brood",
    category: "Bakery",
    pricePerPiece: 1,
    pricePerKg: 3,
    inStock: false,
  },
};

const getPrice = () => {
  let productValue = userInput.value;
  let amountValue = productAmount.value;
  let metricValue = productMetric.value;

  if (supermarketProducts.hasOwnProperty(productValue)) {
    let selectedProduct = supermarketProducts[productValue];

    if (metricValue === "kg") {
      let pricePerKg = selectedProduct.pricePerKg;
      let cardPrice = pricePerKg * Number(amountValue);
      totalPrice += cardPrice;

      console.log(`Price per kg for ${productValue}: €${pricePerKg}`);
      console.log(`Total price is now €${totalPrice.toFixed(2)}`);
      console.log(`CardPrice is now €${cardPrice.toFixed(2)}`);

      return cardPrice;
    } else {
      console.log(`Selected metric is not 'kg', metric is: ${metricValue}`);
    }
  } else {
    console.log(`Product not found: ${productValue}`);
  }
};

function generateId(baseId) {
    toDoCounter++;  // Increment counter for uniqueness
    console.log(toDoCounter);
    return baseId + "_" + toDoCounter;
  }

//functionaliteit
const createTaskCard = () => {
  let productValue = userInput.value;
  let amountValue = productAmount.value;
  let metricValue = productMetric.value;
  const cardPrice = getPrice().toFixed(2);

  if (!amountValue) {
    alert("Vul een hoeveelheid in!");
    return;
  }

  // Creeer de html elementen voor een todo-item in memory
  //div
  const taskItem = document.createElement("div");
  taskItem.classList.add("todo-item");

  //input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = generateId('todo-item');
  console.log("testing variable", checkbox.id)
  checkbox.classList.add("item");

  //label
  const label = document.createElement("label");
  label.setAttribute("for", checkbox.id);
  label.classList.add("todoLabel");
  label.innerText = `${productValue}, ${amountValue} ${metricValue}`;

  //pricetag
  const priceTag = document.createElement("span");
  priceTag.textContent = `€ ${cardPrice}`;
  priceTag.classList.add("price");

  //deletebutton
  const deleteButton = document.createElement("span");
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

  totalPriceSpan.textContent = `Total Price: €${totalPrice.toFixed(2)}`;
  console.log(todoList.innerHTML);

  //event listener toevoegen voor delete knop - captures taskItem from function scope
  deleteButton.addEventListener("click", () => {
    taskItem.remove();
    console.log("prijs check", totalPrice, cardPrice)
    totalPrice -= cardPrice;
    totalPriceSpan.textContent = `Total Price: €${totalPrice.toFixed(2)}`;
    if (!todoList.hasChildNodes()) {
        totalDiv.style.display = "none";
        toDoCounter = 0;
    };
  });
};

//export functionaliteit
const exportToJSON = () => {
  const tasks = [];
  const todoItems = todoList.querySelectorAll(".todo-item"); //roep alle todo-items aan met qSA -> returns NodeList

  // check of todoItems leeg is
  if (todoItems.length === 0) {
    alert("Geen todo-items om te exporteren!");
    return;
  }

  todoItems.forEach((el) => {
    //forEach op NodeList -> el = elk element uit NodeList waarover wordt geitereerd
    const label = el.querySelector(".todoLabel").innerText; //een NodeList contained de HTML structuur per Node -> je kan dus innerText op label roepen
    const [task, amountAndMetric] = label.split(", "); //label tekst splitten op ", " en creëer daar 2 variabelen voor met destructuring assignment over elke Node
    const [amount, metric] = amountAndMetric.split(" "); // hetzelfde voor amount en metric
    // alert(`${todoItems} ${task} ${amountAndMetric} ${metric}`);
    tasks.push({
      task: task,
      amount: amount,
      metric: metric,
    }); //push deze variabelen in array tasks voor elke Node als object
  });

  // converteer array naar JSON (array, replacer function, indentation)
  const jsonString = JSON.stringify(tasks, null, 2);

  // BLOB = binary large object - pass array met de JSON string en geef aan dat het om JSON gaat
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  // alert(url)

  // creeer een element in memory en click het element - met dot notation voeg je attributen href en download toe aan html element. click() is een bestaande methode die een klik naabootst
  const a = document.createElement("a");
  a.href = url;
  a.download = "todolist.json"; // The name of the file
  a.click();

  // verwijderd url uit memory
  URL.revokeObjectURL(url);
};

// event listeners
addButton.addEventListener("click", () => {
  createTaskCard();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addButton.click();
  }
});
exportButton.addEventListener("click", () => {
    exportToJSON();
})
