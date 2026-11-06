const weight = document.getElementById("weight");
const height = document.getElementById("height");
const button = document.getElementById("calculateBtn");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");

button.addEventListener("click", function() {


let berat = parseFloat(weight.value);
let tinggi = parseFloat(height.value);

if (isNaN(berat) || isNaN(tinggi) || berat <= 0 || tinggi <= 0) {
    bmiValue.textContent = "-";
    bmiCategory.textContent = "Masukkan berat dan tinggi yang benar.";
    return;
}

// Tinggi yang dimasukkan dalam cm, jadi diubah ke meter
tinggi = tinggi / 100;

let bmi = berat / (tinggi * tinggi);
let hasil = "";

if (bmi < 18.5) {
    hasil = "Berat badan kurang";
} else if (bmi < 25) {
    hasil = "Normal";
} else if (bmi < 30) {
    hasil = "Overweight";
} else {
    hasil = "Obesitas";
}

bmiValue.textContent = bmi.toFixed(2);
bmiCategory.textContent = hasil;


});