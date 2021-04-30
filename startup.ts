import "reflect-metadata";
import * as  bodyParser from 'body-parser';
import * as cors from 'cors'
import { Container } from 'inversify';
import { InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Application } from "express";

import Database from  './configuration/database'
import IUsuariosRepository from './repository/IUsuariosRepository'
import UsuariosRepositoryMongoDb from './repository/impl/UsuariosRepositoryMongoDb'
import UsuariosService from './services/usuariosService'

require('./controller/usuariosController')


class StartUp{
    public server: InversifyExpressServer;
    private _db : Database;
    private container : Container

    constructor(){
        this.container = new Container();
        this.server =  new InversifyExpressServer(this.container);
        this._db = new Database();
        this._db.createConnection();
        this.configureServer();
        this.configureDependencyInjection();
    }

    configureServer(){
        this.server.setConfig((app) =>{
            app.use(bodyParser.urlencoded({ extended: false}));
            app.use(bodyParser.json());
            this.enableCors(app);
        })
    }

    configureDependencyInjection(){
        this.container.bind<IUsuariosRepository>('IUsuariosRepository').to(UsuariosRepositoryMongoDb);
        this.container.bind<UsuariosService>('UsuariosService').to(UsuariosService);
    }

    enableCors(app : Application){
        const options: cors.CorsOptions = {
            methods: "GET,OPTIONS,PUT,POST,DELETE,PATCH",
            origin: "*"
        }
        app.use(cors(options)); 
    }


}

export default new StartUp();