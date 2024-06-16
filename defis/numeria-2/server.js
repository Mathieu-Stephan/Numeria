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

app.post('/verify', (req, res) => {
  const { code } = req.body;
  console.log({ code });
  const testPath = '/app/test-repo/';

  const fullCode = `
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
    }
  `;

  fs.writeFileSync('full_user_code.js', fullCode);

  exec('node full_user_code.js', (error, stdout, stderr) => {
    if (error) {
      return res.json({ success: false, output: stderr });
    }
    res.json({ success: true, output: stdout });
    console.log(stdout);
  });
});

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