const express = require('express');
const app = express();
const User = require('./model/userSchema');
const Post = require('./model/Post');
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
dotenv.config({ path: './config.env' });
require('./db/conn')

app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello")
})

// registeration 
app.post('/register', async (req, res) => {
    const { username, email, password, cpassword } = req.body;
    if (!username || !email || !password) {
        return res.status(422).send("Fill the details properly")
    }
    try {
        const response = await User.findOne({ email: email })
        if (response) {
            return res.status(422).send("Email already registered try logging in")
        }
        if (password !== cpassword) {
            return res.status(422).send("Password does not match")
        } else {
            const user = new User({ username, email, password, cpassword });
            const registerUser = await user.save();
            if (registerUser) {
                res.status(201).send("Registered Successfully")
            }
        }
    } catch (error) {
        console.log(error);
    }
})

// login 
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Fill the details correctly")
        }
        const user = await User.findOne({ email: email });
        if (user) {
            if (password === user.password) {
                res.status(200).send("Login Successful")
            }


            // bcryptjs
            // const isMatch = await bcrypt.compare(password, user.password);
            // if (isMatch) {
            //     res.status(200).send("Successfully logged in")
            // } else {
            //     res.status(400).send("Invalid Credentials")
            // }
        } else {
            res.status(400).send('Email Not Registered Try Signing Up')
        }
    } catch (error) {
        console.log(error);
    }
})

// forgot password
app.put('/forgot-password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
        if (oldPassword === user.password) {
            const obj = { password: newPassword };
            const obj2 = { cpassword: newPassword };
            user = _.extend(user, obj);
            user = _.extend(user, obj2);
            await user.save();
            return res.status(200).send("Password Updated")
        } else {
            return res.status(400).send("Incorrect old password")
        }
    }
})

//  create posts
app.post('/posts', async (req, res) => {
    const { userId, description, img, likes, comment } = req.body

    try {
        const post = await new Post({ userId, description, img, likes, comment });
        await post.save();
        res.send("Post Created")
    } catch (error) {
        console.log(error);
    }
})

// read post
app.get('/:id/posts', async (req, res) => {
    const { id } = req.params;
    try {
        const userPosts = await Post.find({ userId: id });
        console.log(userPosts);
        res.send(userPosts)
    } catch (error) {
        console.log(error)
    }
})

// update post
app.put('/:id/posts', async (req, res) => {
    const { id } = req.params;
    const { newDescription, newImg } = req.body;
    try {
        let user = await Post.findOne({ userId: id });
        if (user) {
            const obj = { description: newDescription, img: newImg };
            user = _.extend(user, obj);
        }
        await user.save();
        return res.status(200).send("updated");
    } catch (error) {
        console.log(error)
    }
})

// delete post
app.delete('/:id/posts', async (req, res) => {
    const { id } = req.params
    try {
        const posts = await Post.findOne({ userId: id })
        if (posts) {
            await posts.deleteOne()
        }
        res.send("Deleted")
    } catch (error) {
        console.log(error)
    }
})

// like and dislike posts
app.put('/:id/posts/like', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const userPosts = await Post.findOne({ userId: id });
        if (userPosts) {
            if (!userPosts.likes.includes(name)) {
                await userPosts.updateOne({ $push: { likes: name } })
                res.status(200).send("liked");
            } else {
                await userPosts.updateOne({ $pull: { likes: name } })
                res.status(200).send("unliked")
            }
        }
    } catch (error) {
        console.log(error);
    }
})

// comments
app.put('/:id/posts/comment', async (req, res) => {
    const { id } = req.params;
    const { name, comment } = req.body;
    try {
        const userPosts = await Post.findOne({ userId: id });
        if (userPosts) {
            await userPosts.updateOne({ $push: { comment: { name, comment } } })
            res.status(200).send("commented")
        }
    } catch (error) {
        console.log(error)
    }
})



app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
})