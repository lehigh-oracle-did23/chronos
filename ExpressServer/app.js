const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database.js');
const chaincode = require('./chaincode.js')
const bodyParser = require('body-parser');

const app = express();
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const cryptojs = require("./cryptojs");


// get config vars
dotenv.config();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set('port', process.env.PORT || 4001);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop\n');
});

app.get('/api/dropVC', (req, res, next) => {
  const sql = 'DROP TABLE IF EXISTS VCs';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/dropDID', (req, res, next) => {
  const sql = 'DROP TABLE IF EXISTS DIDs';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/dropKeys', (req, res, next) => {
  const sql = 'DROP TABLE IF EXISTS keys';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/key', (req, res, next) => {
  const sql = 'select * from keys';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/key/:pubKey', async (req, res, next) => {
  try {
    let result = await findKeys(req.params.pubKey)

    if (!result) {
      res.status(404).json("Keys not found.");
      return;
    }

    res.json({
      message: 'success',
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.get('/api/VC', (req, res, next) => {
  const sql = 'select * from VCs';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/VC/:id', async (req, res, next) => {
  try {
    let result = await findVCByID(req.params.id);
    if (!result) {
      res.status(404).json("VC not found.");
      return;
    }
    res.json({
      message: 'success',
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.get('/api/DID', (req, res, next) => {
  const sql = 'select * from DIDs';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/api/DID/:id', async (req, res, next) => {
  try {
    let result = await findDIDByID(req.params.id);
    if (!result) {
      res.status(404).json("DID not found.");
      return;
    }
    res.json({
      message: 'success',
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.post('/api/key', (req, res, next) => {
  const errors = [];
  console.log(req.body);
  if (!req.body.pubKey) {
    errors.push('No pubKey specified');
  }
  if (!req.body.privKey) {
    errors.push('No privKey specified');
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  const data = {
    pubKey: req.body.pubKey,
    privKey: req.body.privKey,
  };
  const sql = 'INSERT INTO keys (pubKey, privKey) VALUES (?,?)';
  const params = [data.pubKey, data.privKey];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data
    });
  });
});

app.post('/api/keygen', (req, res, next) => {
  crypto.generateKeyPair(
    'rsa',
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase: 'top secret'
      },
    },
    (err, publicKey, privateKey) => {
      if (!err) {
        const data = {
          pubKey: publicKey,
          privKey: privateKey,
        };
        // console.log("Public Key = " + publicKey)
        // console.log("Private Key = " + privateKey)
        const sql = 'INSERT INTO keys (pubKey, privKey) VALUES (?,?)';
        const params = [data.pubKey, data.privKey];
        db.run(sql, params, function (err, result) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data
          });
        });
      } else {
        console.log(err);
      }
    }
  );
});

app.post('/api/encrypt', (req, res, next) => {
  try {
    const { pubKey } = req.body;
    const message = req.body.data;
    const encryptedData = crypto.publicEncrypt(
      {
        key: pubKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(message)
    );
    console.log(`Encrypted Data: ${encryptedData}`);
    res.status(200).json({ message: 'Success', data: encryptedData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Error' });
  }
});

app.post('/api/decrypt', (req, res, next) => {
  try {
    const { privKey } = req.body;
    const message = req.body.data;
    const decryptedData = crypto.privateDecrypt(
      {
        key: privKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      message
    );

    console.log('decrypted data: ', decryptedData.toString());
    res.status(200).json({ message: 'Success', data: decryptedData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Error' });
  }
});

app.post('/api/sign', (req, res, next) => {
  try {
    const { privKey } = req.body;
    const message = req.body.data;

    const signer = crypto.createSign('RSA-SHA256');
    signer.write(message);
    signer.end();

    // Returns the signature in output_format which can be 'binary', 'hex' or 'base64'
    const signature = signer.sign(privKey, 'base64');

    console.log('Digital Signature: ', signature);
    res.status(200).json({ message: 'Success', data: signature });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Error' });
  }
});

app.post('/api/verify', (req, res, next) => {
  try {
    const { pubKey } = req.body;
    const { signature } = req.body.data;
    const { message } = req.body.data;

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(message);
    verifier.end();

    // Verify file signature ( support formats 'binary', 'hex' or 'base64')
    const result = verifier.verify(pubKey, signature, 'base64');

    console.log(`Digital Signature Verification : ${result}`);
    res.status(200).json({
      message: `Success: The verification outcome is - ${result}`,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Error' });
  }
});


app.post('/api/generateDID', async (req, res, next) => {
  try {

    if(!req.body.key)
    {
      res.status(400).json('Must Provide Key');
    }
    let pubKey = req.body.key;

    // Verify file signature ( support formats 'binary', 'hex' or 'base64')
    let result = await chaincode.createDID(pubKey);

    if(result == null)
    {
      res.status(400).json('DID creation failed');
      return;
    }

    const sql = 'INSERT INTO DIDs (id, pubKey, data) VALUES (?,?,?)';
    const params = [result.id, pubKey, JSON.stringify(result)];
    db.run(sql, params, function (err, rlt) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: `Success`,
        data: result,
      });
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.delete('/api/deleteDID/:DID', async (req, res, next) => {
  try {

    if(!req.params.DID)
    {
      res.status(400).json('Must Provide DID');
    }
    let did = req.params.DID;

    let result = await chaincode.deleteDID(did);

    if(result == null)
    {
      res.status(400).json('DID deletion failed');
      return;
    }

    const sql = 'DELETE FROM DIDs WHERE id = ?';
    const params = [did];
    db.run(sql, params, function (err, rlt) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: `Success`,
        data: result,
      });
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.post('/api/uploadVC', async (req, res, next) => {
  try {
    const vc = req.body.data;
    var data = JSON.stringify(vc);

    const sql = 'INSERT INTO VCs (data) VALUES (?)';
    const params = [data];
    db.run(sql, params, function (err, rlt) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({
        message: `Success`,
        data,
      });
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

findDIDByID = (did) => {
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get('select * from DIDs where id = ?', did, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
};

findKeys = (pubKey) => {
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get('select * from keys where pubKey = ?', pubKey, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
};

findVCByID = (id) => {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get('SELECT * FROM VCs WHERE id = ?', id, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
};

app.post('/api/signVC/:VC', async (req, res, next) => {
  try {
    let id = req.params.VC;
    let vcResult = await findVCByID(id);
    let vc = JSON.parse(vcResult.data);
    let did = vc.credentialSubject.id;

    let didResult = await findDIDByID(did);
    let pubKey = didResult.pubKey;

    let keyResult = await findKeys(pubKey);
    let privKey = keyResult.privKey;

    var d1 = new Date();
    let toSign = vc.credentialSubject;
    let signature = cryptojs.sign(JSON.stringify(toSign), privKey);
    let proof = {"type": "RsaSignature2018", "created": d1.toISOString(), "proofPurpose": "assertionMethod", "jws": signature};

    res.status(200).json({
      message: `Success`,
      VC: vc,
      proof: proof
    });

    return;
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error' });
  }
});

/*
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/
