const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3012;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(express.static('public'));
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200

}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/execute', (req, res) => {
  const { code } = req.body;

  fs.writeFileSync('user_code.js', code);

  exec('node user_code.js', (error, stdout, stderr) => {
    if (error) {
      return res.json({ success: false, output: stderr });
    }
    res.json({ success: true, output: stdout });
  });
});

app.post('/verify/:pseudo/:defi', async (req, res) => {
  const { code } = req.body;
  const { pseudo, defi } = req.params;
  console.log({ code });
  const testPath = '/app/test-repo/';
  const emptyPath = '/app/empty-repo/';
  const invalidPath = '/app/invalid-repo/';
  let nbEtoiles = 0;

  // Fonction pour exécuter du code dans un fichier temporaire
  const executeCode = (code) => {
    return new Promise((resolve, reject) => {
      fs.writeFileSync('full_user_code.js', code);
      exec('node full_user_code.js', (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  try {
    // Test 1: Vérification de la structure de retour
    let fullCode = `
      const fs = require('fs');
      const path = require('path');

      ${code}

      try {
        const result = detectWord("abracadabra", '${testPath}', true, true);
        console.assert(Array.isArray(result) && result.length === 2, 'Return value should be an array of two elements');
        console.assert(result[0].length === 3, 'Test failed');
        console.log('Test Succeed');
      } catch (error) {
        console.error('Error executing the function:', error);
        throw error;
      }
    `;

    await executeCode(fullCode);
    nbEtoiles += 1;
    console.log("1ère étoile.");

  } catch (error) {
    console.log("Test 1 échoué :", error);
  }

  try {
    // Test 2: Vérification de la gestion d'un dossier inexistant
    const fullCodeInvalid = `
      const fs = require('fs');
      const path = require('path');

      ${code}

      try {
        const result = detectWord("abracadabra", '${invalidPath}', true, true);
        console.log('Test failed: no error thrown for non-existent directory');
        throw new Error('Test failed: no error thrown for non-existent directory');
      } catch (error) {
        console.assert(error.message.includes('Le chemin du dossier renseigné'), 'Test Succeeded: correct error message for non-existent directory');
      }
    `;

    await executeCode(fullCodeInvalid);
    nbEtoiles += 1;
    console.log("2ème étoile.");

  } catch (error) {
    console.log("Test 2 échoué :", error);
  }

  try {
    // Test 3: Vérification de la gestion d'un dossier vide
    const fullCodeEmpty = `
      const fs = require('fs');
      const path = require('path');

      ${code}

      try {
        const result = detectWord("abracadabra", '${emptyPath}', true, true);
        console.assert(Array.isArray(result) && result.length === 2, 'Return value should be an array of two elements');
        console.assert(result[0].length === 0, 'Test failed');
        console.log('Test Succeed');
      } catch (error) {
        console.error('Error executing the function:', error);
        throw error;
      }
    `;

    await executeCode(fullCodeEmpty);
    nbEtoiles += 1;
    console.log("3e étoile.");

  } catch (error) {
    console.log("Test 3 échoué :", error);
  }

  res.json({ redirectUrl: `http://localhost:3012/redirectStars/${pseudo}/${defi}/${nbEtoiles}` });
});


app.get('/redirectStars/:pseudo/:defi/:nbEtoiles', (req, res) => {
  const {pseudo, defi, nbEtoiles} = req.params;
  res.send(`
    <script>
      localStorage.removeItem("pseudo");
      localStorage.removeItem("defi");
      window.location.replace("http://localhost:3001/api/getEtoiles/${pseudo}/${defi}/${nbEtoiles}");
    </script>
  `);
})

app.post('/upload-directory', upload.array('files'), (req, res) => {
  const files = req.files;
  let relativePaths = req.body.relativePaths; // Nom du champ du tableau

  if (!Array.isArray(relativePaths)) {
    relativePaths = [relativePaths];
  }

  files.forEach((file, index) => {
    const relativePath = relativePaths[index];
    const relativeDir = relativePath.split('/').slice(1).join('/'); // Remove the root directory
    const dir = path.join('user-repo', path.dirname(relativeDir));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, path.basename(relativeDir)), file.buffer);
  });

  console.log('Fichiers reçus et enregistrés avec succès.');
  res.sendStatus(200);
});

app.get('/redirect', (req, res) => {
  res.send(`
    <script>
      window.location.replace("http://localhost:3000");
    </script>
  `);
});

app.get('/defi/:defi/:pseudo', (req, res) => { 
  const {defi, pseudo} = req.params;
  res.send(`
    <script>
      localStorage.setItem('pseudo', '${pseudo}');
      localStorage.setItem('defi', ${defi});
      window.location.replace('http://localhost:301${defi}/');
    </script>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});