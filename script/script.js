document.addEventListener("DOMContentLoaded", function () {

    // TAB SWITCHING


    const tabs = document.querySelectorAll(".tab");
    const indicator = document.querySelector(".tab-indicator");
    const calculatorSection = document.getElementById("calculatorSection");
    const conversionSection = document.getElementById("conversionSection");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            indicator.style.transform =
                tab.dataset.tab === "calc"
                    ? "translateX(0%)"
                    : "translateX(100%)";

            if (tab.dataset.tab === "calc") {
                calculatorSection.classList.add("active-section");
                conversionSection.classList.remove("active-section");
            } else {
                conversionSection.classList.add("active-section");
                calculatorSection.classList.remove("active-section");
            }
        });
    });


    // THEME TOGGLE

    const themeToggle = document.querySelector(".theme-toggle");

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");

        themeToggle.innerHTML =
            document.body.classList.contains("dark") ? "⚡️" : "🌙";
    });

 
    // CALCULATOR


    const display = document.getElementById("display");

    window.append = function (value) {
        display.value += value;
    };

    window.clearDisplay = function () {
        display.value = "";
    };

    window.deleteLast = function () {
        display.value = display.value.slice(0, -1);
    };

    window.calculate = function () {
        try {
            display.value = eval(display.value);
        } catch {
            display.value = "Error";
        }
    };

    window.toggleSign = function () {
        if (display.value.startsWith("-")) {
            display.value = display.value.substring(1);
        } else if (display.value !== "") {
            display.value = "-" + display.value;
        }
    };

  
    // CONVERTER LOGIC
 

    const conversionMenu = document.getElementById("conversionMenu");
    const converterScreen = document.getElementById("converterScreen");

    const convTitle = document.getElementById("convTitle");
    const unit1Label = document.getElementById("unit1Label");
    const unit2Label = document.getElementById("unit2Label");
    const unit1Value = document.getElementById("unit1Value");
    const unit2Value = document.getElementById("unit2Value");

    const discountExtra = document.getElementById("discountExtra");
    const discountPercentDisplay = document.getElementById("discountPercent");
    const discountAmountDisplay = document.getElementById("discountAmount");
    const discountSwitch = document.getElementById("discountSwitch");

    const bmiExtra = document.getElementById("bmiExtra");
    const bmiWeightDisplay = document.getElementById("bmiWeight");
    const bmiHeightDisplay = document.getElementById("bmiHeight");
    const bmiResultDisplay = document.getElementById("bmiResult");
    const bmiCategoryDisplay = document.getElementById("bmiCategory");

    // Safely get first and last unit blocks
    const unitBlocks = document.querySelectorAll(".conv-body .unit-block");
    const unitBlock1 = unitBlocks[0];
    const unitBlock2 = unitBlocks[unitBlocks.length - 1];

    let currentType = "";
    let inputValue = "";
    let discountPercent = "";
    let discountMode = "price";
    let bmiWeight = "";
    let bmiHeight = "";
    let bmiMode = "weight";

  
    // OPEN CONVERTER


    window.openConverter = function (type) {

        currentType = type;
        inputValue = "";
        discountPercent = "";
        bmiWeight = "";
        bmiHeight = "";

        unit1Value.innerText = "0";
        unit2Value.innerText = "0";
        unit1Label.innerText = "";
        unit2Label.innerText = "";

        unitBlock1.style.display = "none";
        unitBlock2.style.display = "none";
        discountExtra.style.display = "none";
        discountSwitch.style.display = "none";
        bmiExtra.style.display = "none";

        conversionMenu.style.display = "none";
        converterScreen.style.display = "block";
        convTitle.innerText = type.toUpperCase();

        const normalTypes = [
            "length","mass","temperature","area",
            "data","speed","time","volume","currency"
        ];

        if (normalTypes.includes(type)) {

            unitBlock1.style.display = "block";
            unitBlock2.style.display = "block";

            const labels = {
                length: ["Meters", "Feet"],
                mass: ["Kilograms", "Pounds"],
                temperature: ["Celsius", "Fahrenheit"],
                area: ["Square Meters", "Square Feet"],
                data: ["Megabytes", "Gigabytes"],
                speed: ["Km/h", "Miles/h"],
                time: ["Hours", "Minutes"],
                volume: ["Liters", "Milliliters"],
                currency: ["USD", "INR"]
            };

            unit1Label.innerText = labels[type][0];
            unit2Label.innerText = labels[type][1];
        }

        else if (type === "discount") {
            unitBlock1.style.display = "block";
            unitBlock2.style.display = "block";
            discountExtra.style.display = "block";
            discountSwitch.style.display = "block";

            unit1Label.innerText = "Original Price";
            unit2Label.innerText = "Final Price";
        }

        else if (type === "bmi") {
            bmiExtra.style.display = "block";
        }

        updateDisplay();
    };

    window.closeConverter = function () {
        converterScreen.style.display = "none";
        conversionMenu.style.display = "grid";
    };

  
    // KEYPAD INPUT
  

    window.press = function (value) {

        if (currentType === "bmi") {
            bmiMode === "weight"
                ? (bmiWeight += value)
                : (bmiHeight += value);
        }
        else if (currentType === "discount") {
            discountMode === "price"
                ? (inputValue += value)
                : (discountPercent += value);
        }
        else {
            inputValue += value;
        }

        updateDisplay();
    };

    window.clearInput = function () {

        if (currentType === "bmi") {
            bmiMode === "weight" ? (bmiWeight = "") : (bmiHeight = "");
        }
        else if (currentType === "discount") {
            discountMode === "price"
                ? (inputValue = "")
                : (discountPercent = "");
        }
        else {
            inputValue = "";
        }

        updateDisplay();
    };

    window.deleteInput = function () {

        if (currentType === "bmi") {
            bmiMode === "weight"
                ? (bmiWeight = bmiWeight.slice(0, -1))
                : (bmiHeight = bmiHeight.slice(0, -1));
        }
        else if (currentType === "discount") {
            discountMode === "price"
                ? (inputValue = inputValue.slice(0, -1))
                : (discountPercent = discountPercent.slice(0, -1));
        }
        else {
            inputValue = inputValue.slice(0, -1);
        }

        updateDisplay();
    };

    window.switchDiscountInput = function () {
        discountMode = discountMode === "price" ? "percent" : "price";
    };

    window.switchBmiInput = function () {
        bmiMode = bmiMode === "weight" ? "height" : "weight";
    };

   
    // UPDATE DISPLAY


    function updateDisplay() {

        let number = parseFloat(inputValue);
        if (isNaN(number)) number = 0;

        const conversions = {
            length: number * 3.28084,
            mass: number * 2.20462,
            temperature: (number * 9) / 5 + 32,
            area: number * 10.7639,
            data: number / 1024,
            speed: number * 0.621371,
            time: number * 60,
            volume: number * 1000,
            currency: number * 83,
        };

        if (conversions[currentType] !== undefined) {
            unit1Value.innerText = number;
            unit2Value.innerText = conversions[currentType].toFixed(4);
            return;
        }

        if (currentType === "discount") {

            let price = parseFloat(inputValue) || 0;
            let percent = parseFloat(discountPercent) || 0;

            let discountAmount = price * (percent / 100);
            let finalPrice = price - discountAmount;

            unit1Value.innerText = price;
            discountPercentDisplay.innerText = percent;
            discountAmountDisplay.innerText = discountAmount.toFixed(2);
            unit2Value.innerText = finalPrice.toFixed(2);
            return;
        }

        if (currentType === "bmi") {

            let weight = parseFloat(bmiWeight) || 0;
            let height = parseFloat(bmiHeight) || 0;

            bmiWeightDisplay.innerText = weight;
            bmiHeightDisplay.innerText = height;

            if (height > 0) {
                let bmi = weight / (height * height);
                bmiResultDisplay.innerText = bmi.toFixed(2);

                if (bmi < 18.5) bmiCategoryDisplay.innerText = "Underweight";
                else if (bmi < 25) bmiCategoryDisplay.innerText = "Normal";
                else if (bmi < 30) bmiCategoryDisplay.innerText = "Overweight";
                else bmiCategoryDisplay.innerText = "Obese";
            } else {
                bmiResultDisplay.innerText = "0";
                bmiCategoryDisplay.innerText = "-";
            }
        }
    }

});
