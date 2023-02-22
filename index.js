const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { Validator } = require('node-input-validator');
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Trần Văn Cường - Web Developer')
})

app.post('/min-max-sum', async (req, res) => {
    const { arr } = req.body
    try {
        const v = new Validator(req.body, {
            arr: "required|array",
            'arr.*': "required|integer"
        });
        const matched = await v.check();
        if (!matched) {
            return res.send(v.errors)
        }
        // check array is 5 positive integers
        if (arr.length !== 5) {
            return res.send('INVALID_DATA')
        }
        arr.sort(function (a, b) { return a - b });
        const sum = arr.reduce(function (a, b) {
            return a + b;
        });
        return res.send(`${sum - arr[arr.length - 1]} ${sum - arr[0]}`)
    } catch (errors) {
        console.log({ errors })
        return 'OTHER'
    }

})

app.post('/min-max-space', async (req, res) => {
    const { input } = req.body
    try {
        const v = new Validator(req.body, {
            input: "required",
        });
        const matched = await v.check();
        if (!matched) {
            return res.send(v.errors)
        }
        const arr = input.trim().split(' ')
        if (arr.length !== 5) {
            return res.send('INVALID_DATA')
        }
        arr.sort(function (a, b) { return a - b });
        const sum = arr.reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
        });
        return res.send(`${sum - arr[arr.length - 1]} ${sum - arr[0]}`)
    } catch (errors) {
        console.log({ errors })
        return 'OTHER'
    }

})

app.post('/sum-except-input', async (req, res) => {
    try {
        const { input, array_number } = req.body
        const v = new Validator(req.body, {
            input: "required|integer",
            array_number: "required|array",
            "array_number.*": "required|integer"
        });
        const matched = await v.check();
        if (!matched) {
            return res.send(v.errors)
        }
        if (array_number.length !== 5) {
            return res.send('INVALID_DATA')
        }
        const formatArr = array_number.filter((item) => {
            return item !== +input
        })
        const sum = formatArr.reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
        });
        return res.send(`${formatArr.join(' + ')} = ${sum}`)
    } catch (errors) {
        console.log({ errors })
        return 'OTHER'
    }

})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
})