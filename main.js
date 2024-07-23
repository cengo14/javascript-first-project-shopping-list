import {
  clearBtn,
  container,
  displayAlert,
  form,
  grocery,
  list,
  submitBtn,
} from "./js/helpers.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

//*düzenleme seçenekleri
let editElement;
let editFlag = false; // düzenleme modunda olup olmadığını belirtir
let editID = ""; // düzenleme yapılan öğenin benzersiz kimliği

//! Fonksiyonlar
//* silme butonuna tıkladığımızda çlışır
const deleteItem = (e) => {
  //* uzun yol
  // const element = e.target.parentElement.parentElement.parentElement
  //* kısa yol belirli bir kimliğe göre arama yapar
  const element = e.currentTarget.closest(".grocery-item");
  list.removeChild(element);
  displayAlert("Başarıyla Kaldırıldı", "danger");
  let id = element.dataset.id;
  removeFromLocalStorage(id);
};
//* düzenleme butonuna tıkladığımızda çalışır
const editItem = (e) => {
  const element = e.currentTarget.closest(".grocery-item");
  
  editElement = e.target.parentElement.parentElement.previousElementSibling;
  
  
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Düzenle";
};
//*Form gönderildiğinde çalışır
const addItem = (e) => {
  //*Sayfanın yenilenmesini engeller
  e.preventDefault();
  //*İnputun değerini bir değişkene aktarma
  const value = grocery.value;
  //* uuid kütüphanesi kullanarak benzersiz id oluşturma
  const id = uuidv4();

  //*eğer inputun içerisi boş ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    //*yenibir article etiketi oluşturmak için createElement metodunu kullandık
    const element = document.createElement("article");
    //*yeni bir veri kimliği oluştutur
    let attr = document.createAttribute("data-id");
    attr.value = id;

    //* oluşturulan id elementle eklendi
    element.setAttributeNode(attr);

    //* oluşturduğumuz article etiketine grocery-item classını ekledik
    element.classList.add("grocery-item");

    //*oluşturduğumuz article etiketinin içerisine html etiketlerini aktardık ve dinamik yaptık
    element.innerHTML = `
    <p class="title">&#x2714;${value}</p>
    <div class="btn-container">
        <button type="button"class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" type="button">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>`;
    //* list kapsayıcısına oluşturduğumuz articarmutle etiketini ekleme
    list.appendChild(element);
    //*container show-container classı ekleme
    container.classList.add("show-container");
    displayAlert("Başarıla Eklendi", "success");

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    
    addtoLocalStorage(id, value);

    grocery.value = "";
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    submitBtn.textContent = "Ekle";
    displayAlert("Değiştirildi", "success");
    editLocalStorage(editID, value);
    grocery.value = "";
  }
};
const clearItems = () => {
  // container.innerHTML = ""
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");
  localStorage.removeItem("list")
};
//*local storage de veri varsa getir yoksa boş bir dizi döndür
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
//*local storage veri ekle
const addtoLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage()
  // items = items.map((item) => {
  //   if(item.id === id){
  //     item.value = value
  //   }
  //   return item
  items = items.map((item)=> (item.id === id ? {...item, value} : item))
  localStorage.setItem("list", JSON.stringify(items));
  console.log(items)
};
const createListItem = (id, value) => {
  //*yenibir article etiketi oluşturmak için createElement metodunu kullandık
  const element = document.createElement("article");
  //*yeni bir veri kimliği oluştutur
  let attr = document.createAttribute("data-id");
  attr.value = id;
  //* oluşturulan id elementle eklendi
  element.setAttributeNode(attr);

  //* oluşturduğumuz article etiketine grocery-item classını ekledik
  element.classList.add("grocery-item");

  //*oluşturduğumuz article etiketinin içerisine html etiketlerini aktardık ve dinamik yaptık
  element.innerHTML = `
    <p class="title">&#x2714;${value}</p>
    <div class="btn-container">
        <button type="button"class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" type="button">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>`;
  //* list kapsayıcısına oluşturduğumuz articarmutle etiketini ekleme
  list.appendChild(element);
  //*container show-container classı ekleme
  displayAlert("Başarıla Eklendi", "success");

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
};

const setupItem = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

//! Olay izleyicileri
//*forma gönderme olayı ekle ve gönderilme olayında addItem fonksiyonunu calıştır
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);

//* sayfa yüklendiğinde setupItem fonksiyonu çalışır
window.addEventListener("DOMContentLoaded", setupItem);
