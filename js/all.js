//宣告
let resultBtn = document.querySelector('.result-btn');
let changeBtn = document.querySelector('.change-btn');
let btnBox = document.querySelector('.btn-box');
let statusTag = document.querySelector('.status')
let resultList = document.querySelector('.result-list');
let deleteAllBtn = document.querySelector('.delete-all');
// let deleteBtn = document.querySelector('.delete-btn');
let data = JSON.parse(localStorage.getItem('listData')) || [];

//監聽及更新
resultBtn.addEventListener('click', saveData, false);
btnBox.addEventListener('click', switchBtn, false);
deleteAllBtn.addEventListener('click', deleteAllData, false);
resultList.addEventListener('click', deleteData, false);
updateList(data);

//
function init() {
    let records = JSON.parse(localStorage.getItem("listData")) || []
    for (let i = 0; i < records.length; i++) {
        showResult(
            records[i].status,
            records[i].weight,
            records[i].height,
            records[i].bmi,
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
    const weightValue = weightKg.value;
    const heightValue = heightCm.value / "100";
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
    }
    console.log(resultData);
    resultData.status = bmiStatus(resultData.bmi);
    resultData.statusColor = statusColor(resultData.status);
    changeBtn.textContent = 'BMI ' + resultData.bmi;
    statusTag.textContent = resultData.status;
    data.push(resultData);
    localStorage.setItem('listData', JSON.stringify(data));
    updateList(data);
    //switchBtn(e);
    // weightKg.value = ''; //清空欄位
    // heightCm.value = ''; //清空欄位
}

//bmi狀態判斷
function bmiStatus(bmiValue) {
    if (bmiValue < 18.5) {
        statusTag.setAttribute('class', 'status blue-circle')
        changeBtn.setAttribute('class', 'button change-btn blue-circle')
        return '過輕';
        // return {
        // status: '過輕',
        // statusColor: 'green',
        // }
    }
    if (bmiValue >= 18.5 && bmiValue < 24) {
        statusTag.setAttribute('class', 'status green-circle')
        changeBtn.setAttribute('class', 'button change-btn green-circle')
        return '正常';
    }
    if (bmiValue >= 24 && bmiValue < 27) {
        statusTag.setAttribute('class', 'status yellow-circle')
        changeBtn.setAttribute('class', 'button change-btn yellow-circle')
        return '過重';
    }
    if (bmiValue >= 27 && bmiValue < 30) {
        statusTag.setAttribute('class', 'status yellow-orange-circle')
        changeBtn.setAttribute('class', 'button change-btn yellow-orange-circle')
        return '輕度肥胖';
    }
    if (bmiValue >= 30 && bmiValue < 35) {
        statusTag.setAttribute('class', 'status orange-circle')
        changeBtn.setAttribute('class', 'button change-btn orange-circle')
        return '中度肥胖';
    }
    statusTag.setAttribute('class', 'status red-circle')
    changeBtn.setAttribute('class', 'button change-btn red-circle')
    return '重度肥胖';
}

//bmi狀態警示顏色
function statusColor(status) {
    switch (status) {
        case '過輕':
            return 'blue';
        case '正常':
            return 'green';
        case '過重':
            return 'yellow';
        case '輕度肥胖':
            return 'yellow-orange';
        case '中度肥胖':
            return 'orange';
        case '重度肥胖':
            return 'red';
    }
}

//更新resultList
function updateList(items) {
    let str = '';
    let bmi = '';
    for (let i = 0; i < items.length; i++) {
        str += `<li class="${items[i].statusColor}">
            <span>${items[i].status}</span>
            <span>身高 ${items[i].height}cm</span>
            <span>體重 ${items[i].weight}Kg</span>
            <span>bmi值 ${items[i].bmi}</span>
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

//bmi狀態警示顏色
//data.resultData.statusColor