const router = require('express').Router()
const bcrypt = require('bcrypt')
const Users = require('../users/user-model')


router.post('/register', (req, res) => {
    const userInfo = req.body
    const isValid = validateUser(userInfo)
    if(isValid) {
        const rounds = process.env.BCRYPT_ROUNDS || 4
        const hash = bcrypt.hashSync(userInfo.password, rounds)
        userInfo.password = hash

        Users.add(userInfo).then(inserted => {
            res.status(201).json({data: inserted})
        })
    } else {
        res.status(400).json({message: "Invalid information, please verify and try again"})
    }
})

router.post("/login", (req, res) => {
    const creds = req.body;
    const isValid = validateCreds(creds);

    if (isValid) {
        Users.findBy({ username: creds.username }).then(([user]) => {
            if(user && bcryptjs.compareSync(creds.password, user.password)) {

                // req.session.username = user.username
                // req.session.role = user.role

                res.status(200).json({ message: `Welcome ${creds.username}`})
            } else {
                // no user by that name
                res.status(401).json({message: 'You cannot pass'})
            }
        }).catch(err => {
            res.status(500).json({message: 'Error while logging in'})
        })
    } else {
        res.status(400).json({
            message: "Invalid information, plese verify and try again",
        });
    }
});


function validateUser(user){
    return user.username && user.password ? true : false
}

function validateCreds(creds){
    return creds.username && creds.password ? true : false
}
module.exports = router