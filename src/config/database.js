import Sequelize from 'sequelize';

export const db = new Sequelize('auth_node_db','root','',{
    host: 'localhost',
    dialect : 'mysql',
})