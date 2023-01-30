const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')


const uri = 'mongodb+srv://edriselbow:TinderClonePassword@cluster0.nvmfhnw.mongodb.net/?retryWrites=true&w=majority'
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 8000

app.get('/', (req, res) => {
    res.json('hello there')
})

//----------------------------------- SIGNUP -----------------------------------
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body

    const generateduserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)  //learn more about hashed passwords

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')


        //check user exists 
        const existingUser = await users.findOne({email})
        if (existingUser) {
            return res.status(409).send('user already exists, please login')
        }

        const sanitizedEmail = email.toLowerCase()

        //configuring data before adding to database
        const data = {
            user_id: generateduserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }
        const insertedUser = await users.insertOne(data) //inserts user (data) to database


        //insertedUser and sanitizedEmail are required values to generate a token
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,  //expires in 24 hours
        })
        res.status(201).json({token, userId: generateduserId})

    } catch (error) {
        console.log(error)
    }
})

//----------------------------------- LOGIN -----------------------------------
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24,  //expires in 24 hours
            })
            res.status(201).json({token, userId: user.user_id})
        }
        res.status(400).send('invalid credentials')
    } catch (error) {
        console.log(error)
    }
})


//----------------------------------- UPDATING -----------------------------------
app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: formData.user_id}
        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } finally {
        await client.close()  //ensures client will close when finished or error occurs
    }
})










app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()  //ensures client will close when finished or error occurs
    }
})

app.listen(PORT, () => {console.log('listening on port, ' + PORT)})


