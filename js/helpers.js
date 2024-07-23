export let form = document.querySelector(".grocery-form")

export const grocery =document.getElementById("grocery")

export const list = document.querySelector(".grocery-list")

export const container = document.querySelector(".grocery-container")
const alert = document.querySelector(".alert")
export const submitBtn = document.querySelector(".submit-btn")
export const clearBtn = document.querySelector(".clear-btn")

export const displayAlert = (text, action)=>{
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    setTimeout(()=>{
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    },3000)
}