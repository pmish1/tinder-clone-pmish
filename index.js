const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()


const uri = process.env.MONGODB_URL
const app = express()
app.use(cors())
app.use(express.json())
// const PORT = process.env.PORT || 8000



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
        } else {
            res.status(400).send('invalid credentials')
        }
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


//----------------------------------- DASHBOARD -----------------------------------
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {user_id: userId}
        const user = await users.findOne(query)
        res.send(user)


    } finally {
        await client.close()  
    }

}) 

//ONLY DISPLAY THE GENDER THAT USER WANTS 
app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender


    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = { gender_identity: {$eq: gender} }
        const foundUsers = await users.find(query).toArray()  //return users with genders are interested in

        res.send(foundUsers)
    } finally {
        await client.close()  //ensures client will close when finished or error occurs
    }
})

//ADD MATCHES TO USER DATABASE
app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const {userId, matchedUserId} = req.body


    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')


        const query = {user_id: userId}
        const firstUpdateDocument = {
            $push: {matches: {user_id: matchedUserId}}
        }
        const firstMatchesUpload = await users.updateOne(query, firstUpdateDocument)

        const userMatches = await users.findOne({user_id: userId})


        //remove duplicates 
        const jsonObj = userMatches.matches.map(JSON.stringify)
        const uniqueSet = new Set(jsonObj)
        const uniqueArray = Array.from(uniqueSet).map(JSON.parse)


        const user = await users.updateOne(query, {$set: {matches: uniqueArray}})


        res.send(user)
    } finally {
        await client.close()
    }
})

//SHOW MATCHED USERS IN MATCHES DISPLAY
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)


    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline = [
            {
                '$match': {
                    'user_id': {
                        '$in': userIds
                    }
                }
            }
        ]
        const foundUsers = await users.aggregate(pipeline).toArray()

        res.send(foundUsers)

    } finally {
        await client.close()
    }
})


//----------------------------------- CHAT -----------------------------------
app.get('/messages', async (req, res) => {
    const client = new MongoClient(uri)
    const {userId, correspondingUserId} = req.query

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')
    
        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close() 
    }
})


app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')
        
        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})




app.use(express.static(__dirname + '/client/build'))

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html')
})

app.listen(process.env.PORT || 8000)