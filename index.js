// подключение канваса
const canvas = document.getElementById('myChart')
const ctx = canvas.getContext('2d')

// константа для большего удобства
const cur = {
    '145' : 'USD',
    '292' : 'EUR',
    '298' : 'RUR'
}

// функция преобразования даты в формат, пригодный для запроса
function formatedDate(date){

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day
}

// функция, делающая запрос и возвращающая промис
async function getCurrencyData(currencyId, startDate, endDate){
    const url = `https://www.nbrb.by/api/exrates/rates/dynamics/${currencyId}?startdate=${startDate}&enddate=${endDate}`

    let response = await fetch(url)
    if(response.ok) {
        return response.json()
    } else {
        alert('Error http: ' + response.status)
    }
}

// функция обработки клика на кнопку
function clickOnDownload() {

    // получение значений из инпутов
    let currency = +document.getElementById("currency").value
    let dateFrom = document.getElementById("from").value
    let dateTo = document.getElementById("to").value

    // блок проверок
    try {

        // текущая дата и попытка создания даты по полученным данным
        let nowDate = new Date()
        let startDate = new Date(dateFrom.substring(6, 10), dateFrom.substring(3, 5) - 1, dateFrom.substring(0, 2))
        let endDate = new Date(dateTo.substring(6, 10), dateTo.substring(3, 5) - 1, dateTo.substring(0, 2))
        
        // проверка на корректность заполнения инпута 
        if (startDate == 'Invalid Date' || endDate == 'Invalid Date'){
            throw new Error('Невозможно преобразвать введенное значение в дату')
        }

        // проверка на превышение выбранных дат текущей даты
        if (startDate > nowDate || endDate > nowDate){
            throw new Error('Выбранная дата не должна превышать сегодняшнюю дату')
        }

        // проверка на корректный выбор стартовой и конечной даты
        if (startDate >= endDate) {
            throw new Error('Начальная не должна равняться или быть больше конечной даты')
        }

        // преобразование дат к нужному формату
        dateFrom = formatedDate(startDate)
        dateTo = formatedDate(endDate)

        // обработка ответа
        getCurrencyData(currency, dateFrom, dateTo)
        .then(res => {

            // инициализация массивов
            let dataArr = []
            let labelsArr = []

            // парсинг данных из полученного ответа
            for(let i = 0; i < res.length; i++){
                dataArr.push(res[i]['Cur_OfficialRate'])
                labelsArr.push(res[i]['Date'].slice(0, -9))
            }

            // формирование настроек для графика
            const data = {
                labels : labelsArr,
                datasets: [{
                    label: cur[res[0]['Cur_ID']],
                    backgroundColor: 'rgb(255, 255, 255, 0)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth : 1,
                    pointRadius : 2,
                    data: dataArr
                }]
            }

            // создание нового графика
            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {}
            })
        })

    // отлов ошибок и сообщение об это пользователю
    } catch (error) {
        alert(error)
    }
}








