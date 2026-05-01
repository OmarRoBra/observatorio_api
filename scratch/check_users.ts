
import sequelize from '../src/config/database';
import User from '../src/models/user.model';

async function checkUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    
    console.log('--- LISTA DE USUARIOS EN LA BASE DE DATOS ---');
    if (users.length === 0) {
      console.log('No hay usuarios en la base de datos.');
    } else {
      users.forEach(u => {
        console.log(`ID: ${u.id} | Nombre: ${u.name} | Email: ${u.email} | Rol: ${u.role}`);
      });
    }
    console.log('-------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error conectando o consultando:', error);
    process.exit(1);
  }
}

checkUsers();
