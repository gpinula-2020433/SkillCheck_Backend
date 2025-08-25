import {config} from 'dotenv';
import {connect} from './configs/mongo.js'
import {initServer} from './configs/app.js'

config()
connect()
initServer()