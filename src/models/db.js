const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Certifica que a diretoria data existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (fileName) => path.join(DATA_DIR, `${fileName}.json`);

const readData = (fileName) => {
  const filePath = getFilePath(fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Erro ao ler base de dados JSON (${fileName}):`, error);
    return [];
  }
};

const writeData = (fileName, data) => {
  const filePath = getFilePath(fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever na base de dados JSON (${fileName}):`, error);
    return false;
  }
};

module.exports = {
  readData,
  writeData
};
