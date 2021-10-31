import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { User } from '../../types/User';
import { UserModel } from '../../models/UserModel';
import { dbConnect} from '../../middlewares/dbConnect';
import { corsPolicy } from '../../middlewares/corsPolicy';
import { LoginResponse } from '../../types/LoginResponse';
import { DefaultResponse } from '../../types/DefaultResponse';

const handler = async( req : NextApiRequest, res : NextApiResponse<DefaultResponse | LoginResponse>) => {
    try{
        if(req.method !== 'POST' || !req.body){
            return res.status(400).json({ error: 'Metodo informado nao esta disponivel.'});
        }

        const obj : User = req.body;

        if(!obj.name || obj.name.length < 3 || !obj.email || obj.email.length < 6
            || !obj.password || obj.password.length < 4){
            return res.status(400).json({ error: 'Parametros de entrada invalido.'});
        }

        const existingUser = await UserModel.find({ email : obj.email });
        if(existingUser && existingUser.length > 0){
            return res.status(400).json({ error: 'Ja existe usuario com o email informado.'});
        }

        const {MY_SECRET_KEY} = process.env;
        if(!MY_SECRET_KEY){
            return res.status(500).json({error : 'Env MY_SECRET_KEY nao definida'});
        }

        console.log(obj);
        obj.password = md5(obj.password);
        const user = await UserModel.create(obj);
        const token = jwt.sign({ _id : user._id}, MY_SECRET_KEY);
        return res.status(200).json({ name : obj.name, email : obj. email, token});

    }catch(e){
        console.log(e);
        res.status(500).json({ error: 'Ocorreu erro ao cadastrar usuario, tente novamente.'});
    }
} 

export default corsPolicy(dbConnect(handler));