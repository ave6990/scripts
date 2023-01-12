$(document).ready( () => {
	let journal = ''

	let config = {
		records_count: 0,
		rows_count: 20,
		page_num: 0,
		pages_count: 0
	}

	const showPageNum = () => {
		$('#tb_page').val(config.page_num + 1)
		$('#lbl_page').html(` из ${parseInt(config.records_count / config.rows_count) + 1}`)
	}

	const jsonToAOA = (data) => {
		let res = []
		let i = 0
		res[i] = ['№ п/п', 'Номер счета', 'Модификация', 'Номер_ГРСИ', 'Зав. №', 'Год выпуска', 'Номер документа ФИФ', 'Запись в ФИФ']
		data.forEach((row) => {
			i += 1
			res[i] = [row['number'], row['count_number'], row['modification'], row['registry_number'], row['serial_number'],
				row['manufacture_year'], row['fgis_result_docnum'], getRecordFIF(row['fgis_vri_id'])]
		})
		return res
	}

	const getRecordFIF = (num) => {
		return `https://fgis.gost.ru/fundmetrology/cm/results/${num}`
	}

	const renderXLSX = async (data) => {
		let result
		let records = await data.fgis.docs
		const workSheet = await XLSX.utils.aoa_to_sheet(jsonToAOA(data.fgis.docs))
		const table = await XLSX.utils.sheet_to_html(workSheet)
		$('#upload_comment').html(`Найдено ${data.fgis.numFound} записей.`)
		$('#out_data').html(table)
	}

	$('#btn_forward').click(async () => {
		if (config.rows_count < config.records_count && config.page_num * config.rows_count < config.records_count) {
			console.log('Process next page')
			config.page_num += 1
			$('#btn_search').onclick()
			showPageNum()
		}
	})

	$('#btn_back').click(async () => {
		if (config.rows_count < config.records_count && config.page_num > 0) {
			console.log('Process previous page')
			config.page_num -= 1
			$('#btn_search').click()
			showPageNum()
		}
	})

	$('#tb_page').change(async () => {
		let num = parseInt($('#tb_page').val())
		let pages = parseInt(config.records_count / config.rows_count) + 1

		if (num < 1) num = 1
		if (num > pages) num = pages

		config.page_num = num - 1
		$('#btn_search').click()
		showPageNum()
	})

	$('#btn_search').click(async () => {
		const res_filter = {
			fq: {
				verification_year: $('#tb_verification_year').val(),
				org_title: encodeURI(`*${$('#tb_organisation').val()}*`),
				'mi.number': `*${$('#tb_mi_serial_number').val()}*`,
				'mi.mitnumber': `*${$('#tb_mi_type_number').val()}*`,
			},
			q: '*',
			fl: 'vri_id,mi.mitnumber,mi.mitype,mi.modification,mi.number,verification_date,valid_date,result_docnum',
			sort: 'verification_date+desc,org_title+asc',
			rows: 99000,	//config.rows_count,
			start: 0,		//config.rows_count * config.page_num,
		}

		$.ajax({
			url: 'from_fgis',
			method: 'POST',
			cache: false,
			contentType: 'application/json',
			encoding: 'utf-8',
			data: JSON.stringify({
				filter: res_filter,
				journal: journal,
			}),
			success: async (data) => {
				console.log('Successfull upload.')
				config.records_count = data.fgis.numFound
				showPageNum()
				await renderXLSX(data)
			},
			error: (err) => {
				$('#upload_comment').html('Ошибка выгрузки!')
				console.log('Error occured: public/from_fgis.js')
			},
			complete: () => {
				console.log('Complete')
				$('#file').value = null
			}
		})
	})

	$('#file').change(async () => {
		const file = $('#input_file')[0].files[0]
		journal = await file.text()
		console.log('Uploaded')
	})

	const getJSON = async (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = (obj) => {
				console.log(obj)
				const data = new Uint8Array(obj.target.result)
				console.log(data)
				const wb = XLSX.read(data, {type: 'array'})
				console.log(wb)
				resolve(XLSX.utils.sheet_to_json(wb.Sheets.Sheet1))
			}
			reader.readAsArrayBuffer(file)
		})
	}
})
