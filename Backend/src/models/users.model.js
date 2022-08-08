import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from 'validator';
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
//By default, Mongoose adds an _id property to your schemas.
//const schema = new Schema();
//schema.path('_id'); // ObjectId { ... }

//To include virtuals in res.json(), you need to set the toJSON schema option to { virtuals: true }.
const opts = { toJSON: { virtuals: true } };
//Schema with inbuild validation 
const usersSchema = new Schema({
    fname:  {
        type:String, // String is shorthand for {type: String}
        required:true,
        trim:true,
        minLength:2
    },
    lname:  {
        type:String, // String is shorthand for {type: String}
        required:true,
        trim:true,
        minLength:2
    },
    // full_name:  {
    //     type:String, // String is shorthand for {type: String}
    //     required:true,
    //     trim:true,
    //     minLength:2
    // },
    username:  {
        type:String, // String is shorthand for {type: String}
        required:true,
        trim:true,
        minLength:5,
        maxLength:15
    },
    hashedPassword:  {
        type:String, // String is shorthand for {type: String}
        required:true,
        trim:true,
        minLength:6,
        maxLength:70
    },
    email:{
        type:String,
        unique:true,
        validate: (val)=>{
            if(!validator.isEmail(val)){
                throw new Error(`invalid email ${val}`);
            }
        }
    },
    address: {
        city: {
            type:String,
            trim:true,
            minLength:2
        },
        state: {
            type:String,
            trim:true,
            minLength:2
        },
        country: {
            type:String,
            trim:true,
            minLength:2
        }
    },
    age:{
        type:Number,
        min:18,
        max:99,
        //This is custom validation
        validate:(val)=>{
            if(val <= 17)
                throw new Error(`minimum age to register is 18`);
        }
    },
    contact:{
        type:Number,
        min:10,
        max:12
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
//});
},opts);

usersSchema.methods.comparePassword = function(candidatePassword, cb) {
    const abc  = bcrypt.compare(candidatePassword, this.hashedPassword, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//Generating token
usersSchema.methods.generateToken = async function() {
    try{
        //Simple token 
        var tokenSample = jwt.sign({ _id: this._id }, process.env.JWT_SECRETE_KEY,{ expiresIn: 60 * 60 });
        console.log("Token Sample - ", tokenSample);
        // sign with RSA SHA256 - create token
        // var tokenRSA = jwt.sign({ email: this.email }, process.env.JWT_SECRETE_KEY, { algorithm: 'RS256'},{ expiresIn: 60 * 60 });
        //console.log("Token RSA - ", tokenRSA); 
        this.tokens = this.tokens.concat({token:tokenSample});
        await this.save();
        return tokenSample;
    }catch(error){
        console.log("token could not generate ");
    }
};

/*VIRTUAL*/
//use to compute something on request param which is not stored in mongodb and not present in document.
// THIS VIRTUQAL VALUES ATTACHED TO QUERY RESULT if we set virtual true in Schema, this values not actually present in mongodb doc 
//like if we have firstname and last name then we never make field full name to fill up on user end.
// Create a virtual property `fullName` with a getter and setter.
usersSchema.virtual('fullName').
    get(function() { 
        return `${this.fname} ${this.lname}`; 
    }).
    set(function(v) {
        // `v` is the value being set, so use the value to set
        // `firstName` and `lastName`.
        const firstName = v.substring(0, v.indexOf(' '));
        const lastName = v.substring(v.indexOf(' ') + 1);
        const sirname = "Patil";
        this.set({ firstName, lastName, sirname });
    });
//Suppose you have a User model. Every user has an email, but you also want the email's domain. 
//For example, the domain portion of 'test@gmail.com' is 'gmail.com'.
// Create a virtual property `domain` that's computed from `email`.

usersSchema.virtual('domain').get(function() {
    //console.log("virtual domain : ",this.email);
    return this.email.slice(this.email.indexOf('@') + 1);
});

// let doc = await User.create({ email: 'test@gmail.com' });
// // `domain` is now a property on User documents.
// doc.domain; // 'gmail.com'

// This is the important bit- Using a virtual lets me pass `{ password: 'xyz' }` without actually having it save.
// Instead it is caught by this setter which performs the hashing and saves the hash to the document's hash property.
// usersSchema.virtual('password').set(function(value) {
//     const salt = bcrypt.genSaltSync(10)
//     this.hashedPassword = bcrypt.hashSync(this.hashed, salt)
// })

//Define middleware before the model compile then only run it.
//Mongoose middleware - use to process data before store in database
usersSchema.pre('updateOne', function (next) {
    //const data = this.getUpdate();
    const userRecord = this;
    const password = this.getUpdate().$set.hashedPassword;
    if (!password) {
       return next();
    }else{
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            // hash the password using our new salt
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) return next(err);
                // override the cleartext password with the hashed one
                userRecord.getUpdate().$set.hashedPassword = hash;
                next();
            },this);
        },this);
    }
});

usersSchema.pre("save", function(next) {
    const SALT_WORK_FACTOR = 10; //integer gives us control over what the computing cost of processing the data
    var userRecord = this;
    // only hash the password if it has been modified (or is new)
    if (!userRecord.isModified('hashedPassword')) return next();
    // Make Hash password using bcrypt library - generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(userRecord.hashedPassword, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            userRecord.hashedPassword = hash;
            next();
        });
    });
});

/*implement middleware that check validation of schema while update records*/
usersSchema.pre('updateMany', function (next) {
    //actully we append this option to query statement like collation for case insensiveness  
    this.options.runValidators = true;
    next();
});

usersSchema.pre('findByIdAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

//Define middleware before the model compile then only run it.
usersSchema.post('save', function(doc) {
    //console.log('email domain - %s & full name -%s, has been saved', doc.domain,doc.fullName);
    // Vanilla JavaScript assignment triggers the setter
    //doc.fullName = 'Jean-Luc Picard';
});

//make collection schema and name it as Users(we have to pass sibngular name it will create plural un mongodb)
//module.exports = mongoose.model(User, usersSchema);
//compile model from the schema
const User = mongoose.model('user', usersSchema);
export { User };
