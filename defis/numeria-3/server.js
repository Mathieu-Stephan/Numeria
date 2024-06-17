const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3013;

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

      ${code}

      try {
        const result = generatePassword(5, []);
        console.error('Test Failed: only password with minimum 8 characters');
      } catch (error) {
        console.assert(error.message.includes(''), 'Test Succeeded: correct error message for wrong password length');
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

      ${code}

      try {
        const result = generatePassword(9, ["motdepasse"]);
        console.assert(result[0].includes("motdepasse"), 'Test Failed');
        console.log('Test Succeed');
      } catch (error) {
        console.error('Test failed');
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
        const result = generatePassword(9, []);
        console.assert(typeof(result[0]) == 'string', 'Test failed');
        console.log('Test Succeed');
      } catch (error) {
        console.error('Test failed');
      }
    `;

    await executeCode(fullCodeEmpty);
    nbEtoiles += 1;
    console.log("3e étoile.");

  } catch (error) {
    console.log("Test 3 échoué :", error);
  }

  res.json({ redirectUrl: `http://localhost:3013/redirectStars/${pseudo}/${defi}/${nbEtoiles}` });
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