import {getInput, debug, setOutput, setFailed} from '@actions/core';
import {exec} from 'child_process';
import {Obfuscator} from './obfuscator';
// import {readFileSync, writeFileSync} from 'fs';
import {promises} from 'fs';
import {join} from 'path';

async function run(): Promise<void> {
  try {
    const folder = getInput('folder');
    const dockerFile = await promises.readFile(join(folder, 'Dockerfile'));
    const obf = new Obfuscator(dockerFile.toString());

    const newDockerFile = obf.dumpEncrypted();
    await promises.writeFile(join(folder, 'Dockerfile'), newDockerFile);
    await obf.compile(join(folder, 'csteps'));
  } catch (error) {
    setFailed(error.message);
  }
}

run();
