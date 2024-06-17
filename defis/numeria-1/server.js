const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3011;

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
    let fullCode = `
      const fs = require('fs');

      ${code}

      try {
        const result = correcteurOrthographique("informatque", ["informatique"], 1);
        console.assert(Array.isArray(result) && result.length === 2, 'Return value should be an array of two elements');
        console.assert(result[0] == "informatique", 'Test failed');
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
    const fullCodeInvalid = `
      const fs = require('fs');

      ${code}

      try {
        const result = correcteurOrthographique("informatque supr", ["informatique"], 2);
        console.assert(result[0] == "informatique supr", 'Test failed');
        console.log('Test Succeed');
      } catch (error) {
        console.error('Error executing the function:', error);
        throw error;
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

      ${code}

      try {
        const result = correcteurOrthographique("infmatique suer gd", ["informatique", "super", "grand"], 2);
        console.assert(result[0] == "informatique super gd", 'Test failed');
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

  res.json({ redirectUrl: `http://localhost:3011/redirectStars/${pseudo}/${defi}/${nbEtoiles}` });
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