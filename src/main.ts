import {getInput, debug, setOutput, setFailed} from '@actions/core';
import {wait} from './wait';
import {exec} from 'child_process';

async function run(): Promise<void> {
  try {
    exec('ls -lh', (error, stdout, stderr) => debug(stdout));
    const branch: string = getInput('branch');
    debug(`Will write to branch ${branch} `); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    setFailed(error.message);
  }
}

run();
