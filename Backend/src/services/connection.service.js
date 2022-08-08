import { mongoose } from 'mongoose';
import {connection_config} from '../configs/mongodb.config.js';

const { database: { host, port, dbname } } = connection_config;
const connectionString = `mongodb://${host}:${port}/${dbname}`;

export const establishConn = async()=>{
    //await mongoose.connect("mongodb://localhost:27017/practice-mern-app-db",
    await mongoose.connect(connectionString,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => {
        console.log(`Database connection established successfully!!!`);
    })
    .catch((e) => {
        console.error(`Database connection failed!!!`,e);
    });
}

// module.exports = {
//     establishConn
// }
  