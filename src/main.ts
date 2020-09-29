import {getInput, debug, setOutput, setFailed} from '@actions/core';
import {wait} from './wait';
import {exec} from 'child_process';
import {Obfuscator} from './obfuscator';
// import {readFileSync, writeFileSync} from 'fs';
import {promises} from 'fs';

async function run(): Promise<void> {
  try {
    const dockerFile = await promises.readFile('Dockerfile');
    console.log(dockerFile.toString());
    const obf = new Obfuscator(dockerFile.toString());

    const newDockerFile = obf.dumpEncrypted();
    await promises.writeFile('Dockerfile', newDockerFile);
    await obf.compile('csteps');
    exec('cat Dockerfile', (error, stdout, stderr) => debug(stdout));

    exec('sync; ls -lh', (error, stdout, stderr) => debug(stdout));

    debug(obf.dumpC());

    const branch: string = getInput('branch');
    debug(`Will write to branch ${branch} `); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    // setFailed(error.message);
  }
}

run();
