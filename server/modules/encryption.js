const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
let verbose = true; // used to show explanations for learning
const publicAPI = {
    encryptPassword(password) {
        if (verbose) {
            console.log('encrypting password:', password);
            console.log('creating salt with SALT_WORK_FACTOR of:', SALT_WORK_FACTOR);            
        }
        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR); // this generates a random salt
        if(verbose) console.log('salt:', salt);
        // This next line hashes the user password and the random salt
        // this salt and hash (and not the actual password) will then get stored in the database
        if(verbose) console.log('bcrypt.hashSync(password, salt):', bcrypt.hashSync(password, salt));
        return bcrypt.hashSync(password, salt);
    },
    comparePassword(candidatePassword, storedPassword) {
        /*
            This takes in the candidate password (what the user entered) to check it.
            The stored password has the original salt, so it will run the candiate password
            and salt through the same hashing process as before. If that result is the same as the 
            stored password, then we have a match! If this interests you, check out this video 
            https://www.youtube.com/watch?v=8ZtInClXe1Q
        */
        if(verbose) console.log('bcrypt.compareSync with:', candidatePassword, storedPassword);
        return bcrypt.compareSync(candidatePassword, storedPassword);
    },  
};

module.exports = publicAPI