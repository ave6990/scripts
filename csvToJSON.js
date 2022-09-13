import fs from 'fs'
import csvParser from 'csv-parser'

const results = []

console.info('Запуск csv-parser.')

const filePath = process.argv.slice(2)[0]

const timestamp = () => {
    const d = new Date()
    return `${d.getFullYear()}${d.getMonth()}${d.getDate()}-${d.getHours()}${d.getMinutes()}`
}

const resFileName = `result_${timestamp()}.json`

if (filePath) {
    console.info(`Обработка файла '${filePath}'...`)
    let i = 0

    fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', }))
        .on('data', (data) => {
            results.push(data)
            i++
        })
        .on('end', () => {
            console.info(`Обработано ${i} строк.`)
            fs.writeFileSync(resFileName, JSON.stringify(results))
            console.info(`Результат записан в файл.`)
        })
}
else {
    console.error('Необходимо указать путь к файлу.')
}
