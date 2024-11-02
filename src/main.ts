import Sortable, { SortableEvent } from "sortablejs";

// get elements from HTML
const userInput = document.getElementById("userInput") as HTMLOptionElement;
const productAmount = document.getElementById(
  "productAmount"
) as HTMLInputElement;
const productMetric = document.getElementById(
  "productMetric"
) as HTMLOptionElement;
const addButton = document.getElementById("addButton") as HTMLButtonElement;
const todoList = document.getElementById("todolist") as HTMLElement;
const exportButton = document.getElementById("export") as HTMLButtonElement;
const totalDiv = document.getElementById("total") as HTMLElement;
const totalPriceSpan = document.getElementById("total-price") as HTMLElement;
const uploadButton = document.getElementById("upload") as HTMLButtonElement;
const uploadFileInput = document.getElementById(
  "uploadFile"
) as HTMLInputElement;
const deleteButton = document.getElementById("delete-all") as HTMLButtonElement;
let totalPrice: number = 0;
let toDoCounter: number = 0;

interface Product {
  readonly id: number;
  name: string;
  category: string;
  pricePerPiece: number | null;
  pricePerKg: number | null;
  inStock: boolean;
}

interface ProductSelection {
  [key: string]: Product;
}

const supermarketProducts: ProductSelection = {
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

const getPrice = (): number => {
  let productValue: string = userInput.value;
  let amountValue: string = productAmount.value;
  let metricValue: string = productMetric.value;
  let cardPrice: number = 0;

  if (supermarketProducts.hasOwnProperty(productValue)) {
    let selectedProduct = supermarketProducts[productValue];

    if (metricValue === "kg" && selectedProduct.pricePerKg) {
      let pricePerKg: number = selectedProduct.pricePerKg;
      cardPrice = pricePerKg * Number(amountValue);
      totalPrice += cardPrice;
      console.log(`Price per kg for ${productValue}: €${pricePerKg}`);
      console.log(`Total price is now €${totalPrice.toFixed(2)}`);
      console.log(`CardPrice is now €${cardPrice.toFixed(2)}`);
      return cardPrice;
    } else if (metricValue === "stuks" && selectedProduct.pricePerPiece) {
      let pricePerPiece = selectedProduct.pricePerPiece;
      let cardPrice = pricePerPiece * Number(amountValue);
      totalPrice += cardPrice;
      return cardPrice;
    }
  }
  return cardPrice;
};

function generateId(baseId: string): string {
  toDoCounter++;
  console.log(toDoCounter);
  return baseId + "_" + toDoCounter;
}

//functionaliteit
const createTaskCard = (): void => {
  let productValue: string = userInput.value;
  let amountValue: string = productAmount.value;
  let metricValue: string = productMetric.value;

  const cardPrice: number = getPrice();

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
  checkbox.id = generateId("todo-item");
  console.log("testing variable", checkbox.id);
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

  totalPriceSpan.textContent = `Totaal: €${totalPrice.toFixed(2)}`;
  console.log(todoList.innerHTML);

  //event listener toevoegen voor delete knop - captures taskItem from function scope
  deleteButton.addEventListener("click", () => {
    taskItem.remove();
    console.log("prijs check", totalPrice, cardPrice);
    totalPrice -= cardPrice;
    totalPriceSpan.textContent = `Totaal: €${totalPrice.toFixed(2)}`;
    if (!todoList.hasChildNodes()) {
      totalDiv.style.display = "none";
      toDoCounter = 0;
    }
  });
};

interface Task {
  task: string;
  amount: string;
  metric: string;
  price: string;
}

//export functionaliteit
const exportToJSON = (): void => {
  const tasks: Task[] = [];
  const todoItems = todoList.querySelectorAll<HTMLElement>(".todo-item");

  // check of todoItems leeg is
  if (todoItems.length === 0) {
    alert("Geen todo-items om te exporteren!");
    return;
  }

  todoItems.forEach((el) => {
    const label = el.querySelector<HTMLElement>(".todoLabel")?.innerText;
    const [task, amountAndMetric] = label ? label.split(", ") : ["", ""]; // Handle potential null values - label tekst splitten op ", " en creëer daar 2 variabelen voor met destructuring assignment over elke Node
    const [amount, metric] = amountAndMetric
      ? amountAndMetric.split(" ")
      : ["", ""]; // hetzelfde voor amount en metric

    const price = el.querySelector<HTMLElement>(".price")?.innerText!;

    tasks.push({
      task: task,
      amount: amount,
      metric: metric,
      price: price,
    });
  });

  // converteer array naar JSON (array, replacer function, indentation)
  const jsonString = JSON.stringify(tasks, null, 2);

  // BLOB = binary large object - pass array met de JSON string en geef aan dat het om JSON gaat
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // creeer een element in memory en click het element - met dot notation voeg je attributen href en download toe aan html element.
  const a = document.createElement("a");
  a.href = url;
  a.download = "todolist.json";
  a.click();

  // verwijderd url uit memory
  URL.revokeObjectURL(url);
};

const loadTasksFromJSON = (tasks: Task[]): void => {
  tasks.forEach((task) => {
    userInput.value = task.task;
    productAmount.value = task.amount;
    productMetric.value = task.metric;
    createTaskCard();
  });
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
});

userInput.addEventListener("change", () => {
  const selectedOption = userInput.value;

  productMetric.innerHTML = `
    <option value="stuks">stuks</option>
    <option value="kg">kg</option>
  `;

  if (supermarketProducts.hasOwnProperty(selectedOption)) {
    let selectedProduct = supermarketProducts[selectedOption];

    if (selectedProduct.pricePerKg === null) {
      const kgOption = productMetric.querySelector('option[value="kg"]');
      if (kgOption) {
        kgOption.remove();
      }
    }
    if (selectedProduct.pricePerPiece === null) {
      const pieceOption = productMetric.querySelector('option[value="stuks"]');
      if (pieceOption) {
        pieceOption.remove();
      }
    }
  }
});

window.addEventListener("load", () => {
  const mainContainer = document.getElementById("container") as HTMLElement;
  mainContainer.className = "animate-up";
});

uploadButton.addEventListener("click", () => {
  uploadFileInput.click();
});

uploadFileInput.addEventListener("change", (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null; // Access the first file (should be only one)

  if (file) {
    const reader = new FileReader(); // Create a new FileReader to read the file contents

    // Define what happens when the file is successfully read
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string; // Get the file content
      try {
        const tasks = JSON.parse(content); // Parse the JSON content into an array of tasks
        loadTasksFromJSON(tasks); // Call a function to populate the tasks in the to-do list
      } catch (error) {
        console.error("Invalid JSON file:", error); // Handle error if JSON is invalid
        alert("The uploaded file is not valid JSON!");
      }
    };
    reader.readAsText(file); // Read the file as a plain text (which should be JSON)
  }
});

deleteButton.addEventListener("click", () => {
  if (
    window.confirm("Weet je zeker dat je alle boodschappen wilt verwijderen?")
  ) {
    todoList.innerHTML = "";
    totalPrice = 0;
    toDoCounter = 0;
    totalDiv.style.display = "none";
  }
});

const sortable = new Sortable(todoList, {
  animation: 150,
  ghostClass: "dragging",
  onStart: (evt) => {
    document.body.style.cursor = "grabbing";
  },
  onEnd: (event) => {
    document.body.style.cursor = "";
    console.log("Dragged item from", event.oldIndex, "to", event.newIndex);
  },
});
