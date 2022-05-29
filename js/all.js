// calories 係數表
const caloriesList = {
    Status_UnderWeight_Level_1: 35,
    Status_UnderWeight_Level_2: 40,
    Status_UnderWeight_Level_3: 45,
    Status_Normal_Level_1: 30,
    Status_Normal_Level_2: 35,
    Status_Normal_Level_3: 40,
    Status_OverWeight_Level_1: 25,
    Status_OverWeight_Level_2: 30,
    Status_OverWeight_Level_3: 35,
}

const statusToListKey = {
    "過輕": "UnderWeight",
    "正常": "Normal",
    "過重": "OverWeight",
    "輕度肥胖": "OverWeight",
    "中度肥胖": "OverWeight",
    "重度肥胖": "OverWeight"
}

const optionToListKey = {
    "輕度工作": 1,
    "中度工作": 2,
    "重度工作": 3
}

//宣告
let resultBtn = document.querySelector('.result-btn');
let changeBtn = document.querySelector('.change-btn');
let btnBox = document.querySelector('.btn-box');
let statusTag = document.querySelector('.status')
let resultList = document.querySelector('.result-list');
let activitySelect = document.querySelector('.activity-select');
let deleteAllBtn = document.querySelector('.delete-all');
let data = JSON.parse(localStorage.getItem('listData')) || [];

//監聽及更新
resultBtn.addEventListener('click', saveData, false);
btnBox.addEventListener('click', switchBtn, false);
deleteAllBtn.addEventListener('click', deleteAllData, false);
resultList.addEventListener('click', deleteData, false);
// activitySelect.addEventListener('change', calorieCal, false);
updateList(data);

//
function init() {
    let data = JSON.parse(localStorage.getItem("listData")) || []
    for (let i = 0; i < data.length; i++) {
        showResult(
            data[i].status,
            data[i].weight,
            data[i].height,
            data[i].bmi,
            data[i].calories,
            i
        )
    }
}

//收集資料
function saveData(e) {
    e.preventDefault();
    let weightKg = document.querySelector('.weight-value');
    let heightCm = document.querySelector('.height-value');
    if (weightKg.value == '' || heightCm.value == '') {
        changeBtn.setAttribute('class', 'button change-btn hide');
        resultBtn.setAttribute('class', 'button result-btn');
        alert('請輸入身高及體重');
        return;
    };
    let activitySelect = document.querySelector('.activity-select');
    const weightValue = weightKg.value;
    const heightValue = heightCm.value / "100";
    const activity = activitySelect.value
    console.log(heightValue);
    const bmi = weightValue / (heightValue * heightValue);
    const bmiValue = bmi.toFixed(2);
    console.log(bmiValue);
    let resultData = {
        status: '',
        statusColor: '',
        weight: weightValue,
        height: heightCm.value,
        bmi: bmiValue,
        calories: '',
        activity: activity,
    }

    let statusDetail = bmiStatus(resultData.bmi)
    let listKey = `Status_${statusToListKey[statusDetail.status]}_Level_${optionToListKey[activity]}`

    resultData.status = statusDetail.status;
    resultData.statusColor = statusDetail.color;
    changeBtn.textContent = 'BMI ' + resultData.bmi;
    statusTag.textContent = resultData.status;
    resultData.calories = caloriesList[listKey] * weightValue;

    data.push(resultData);
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
}

// bmi狀態判斷, 顏色
function bmiStatus(bmiValue) {
    let statusDetail = {}
    if (bmiValue < 18.5) {
        statusTag.setAttribute('class', 'status blue-circle')
        changeBtn.setAttribute('class', 'button change-btn blue-circle')
        statusDetail.status = '過輕';
        statusDetail.color = 'blue';
    }
    if (bmiValue >= 18.5 && bmiValue < 24) {
        statusTag.setAttribute('class', 'status green-circle')
        changeBtn.setAttribute('class', 'button change-btn green-circle')
        statusDetail.status = '正常';
        statusDetail.color = 'green';
    }
    if (bmiValue >= 24 && bmiValue < 27) {
        statusTag.setAttribute('class', 'status yellow-circle')
        changeBtn.setAttribute('class', 'button change-btn yellow-circle')
        statusDetail.status = '過重';
        statusDetail.color = 'yellow';
    }
    if (bmiValue >= 27 && bmiValue < 30) {
        statusTag.setAttribute('class', 'status yellow-orange-circle')
        changeBtn.setAttribute('class', 'button change-btn yellow-orange-circle')
        statusDetail.status = '輕度肥胖';
        statusDetail.color = 'yellow-orange';
    }
    if (bmiValue >= 30 && bmiValue < 35) {
        statusTag.setAttribute('class', 'status orange-circle')
        changeBtn.setAttribute('class', 'button change-btn orange-circle')
        statusDetail.status = '中度肥胖';
        statusDetail.color = 'orange';
    }
    if (bmiValue >= 35) {
        statusTag.setAttribute('class', 'status red-circle')
        changeBtn.setAttribute('class', 'button change-btn red-circle')
        statusDetail.status = '重度肥胖';
        statusDetail.color = 'red';
    }

    return statusDetail
}

//更新resultList
function updateList(items) {
    let str = '';
    for (let i = 0; i < items.length; i++) {
        str += `<li class="${items[i].statusColor}">
            <span>${items[i].status}</span>
            <span>身高 ${items[i].height}cm</span>
            <span>體重 ${items[i].weight}Kg</span>
            <span>BMI值 ${items[i].bmi}</span>
            <span>建議熱量 ${items[i].calories} 大卡</span>
            <span class="delete-btn" data-index="${i}">刪除</span>
        </li>`

    }
    resultList.innerHTML = str;
}

//刪除單筆資料
function deleteData(e) {
    e.preventDefault();
    let index = e.target.dataset.index;
    if (e.target.nodeName !== 'SPAN') { return };
    console.log(e);
    data.splice(index, 1);
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
}

//刪除全部資料
function deleteAllData(e) {
    e.preventDefault();
    data = [];
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
}

//切換按鈕
function switchBtn(e) {
    let weightKg = document.querySelector('.weight-value');
    let heightCm = document.querySelector('.height-value');
    if (weightKg.value == '' || heightCm.value == '') {
        changeBtn.setAttribute('class', 'button change-btn hide');
        resultBtn.setAttribute('class', 'button result-btn');
        return;
    };
    if (e.target.textContent === '看結果') {
        resultBtn.classList.add('hide');
        changeBtn.classList.remove('hide')
        statusTag.classList.remove('hide');
    } else {
        resultBtn.classList.remove('hide');
        changeBtn.classList.add('hide')
        statusTag.classList.add('hide');
        weightKg.value = ''; //清空欄位
        heightCm.value = '';
    }
}



//熱量判斷及計算
// function calorieCal(status, activityLevel) {
//     let weightKg = document.querySelector('.weight-value').value;
//     let statusKey = statusToListKey[status] // 等於 statusToListKey.${status}
//     let optionKey = optionToListKey[activityLevel]
//     let listKey = `Status_${statusToListKey[status]}_Level_${optionToListKey[activityLevel]}`

//     return caloriesList[`Status_${statusToListKey[status]}_Level_${optionToListKey[activityLevel]}`] * weightKg
// if (status == '過輕') {
//     if (activityLevel == '輕度工作') {
//         return 35 * weightKg
//     }
//     if (activityLevel == '中度工作') {
//         return 40 * weightKg
//     }
//     if (activityLevel == '重度工作') {
//         return 45 * weightKg
//     }
// }
// if (status == '正常') {
//     if (activityLevel == '輕度工作') {
//         return 30 * weightKg
//     }
//     if (activityLevel == '中度工作') {
//         return 35 * weightKg
//     }
//     if (activityLevel == '重度工作') {
//         return 40 * weightKg
//     }
// } else {
//     if (activityLevel == '輕度工作') {
//         return 25 * weightKg
//     }
//     if (activityLevel == '中度工作') {
//         return 30 * weightKg
//     }
//     if (activityLevel == '重度工作') {
//         return 35 * weightKg
//     }
// }
// }

//bmi狀態警示顏色
//data.resultData.statusColor