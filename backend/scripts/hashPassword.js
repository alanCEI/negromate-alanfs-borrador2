import bcrypt from 'bcrypt';

// Cambia esto por la contraseña que quieras
const plainPassword = 'admin123';

const hashPassword = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    console.log('=======================================');
    console.log('Contraseña en texto plano:', plainPassword);
    console.log('Contraseña hasheada:', hashedPassword);
    console.log('=======================================');
    console.log('\nUsa este valor en el campo "password" de MongoDB:');
    console.log(hashedPassword);
};

hashPassword();
