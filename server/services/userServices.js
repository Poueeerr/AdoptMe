import userRepository from '../repositories/userRepository.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const createUser = async (name, email, password) => {
    if (!email.includes('@')) throw new Error('Invalid email');

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser != null) throw new Error('Email is already registered');

    password = await bcrypt.hash(password, 10);
    
    const response = userRepository.createUser({ name, email, password });
    const token = jwt.sign(
        {id: response.id, email: response.email}, 
        process.env.JWT_SECRET, 
        {expiresIn: '5h'})
    
    return {...response, token}
}

const login = async (email, password) =>{
    
  const user = await userRepository.findByEmail(email);
  if (user == null) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Senha incorreta');
  } 

  const token = jwt.sign(
    {id: user.id, email: user.email}, 
    process.env.JWT_SECRET, 
    {expiresIn: '5h'})
  return {...user, token};
}

const getUsers = async () =>{
    return userRepository.findAll();
}

const getUsersByEmail = async (email) =>{
    return userRepository.findByEmail(email);
}

const getUsersById = async (id) =>{
    return userRepository.findById(id);
}


export default {createUser, getUsers, getUsersByEmail, getUsersById, login}