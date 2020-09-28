import {getInput, debug, setOutput, setFailed} from '@actions/core';
import {wait} from './wait';
import {exec} from 'child_process';

async function run(): Promise<void> {
  try {
    exec('ls -lh', (error, stdout, stderr) => console.log(stdout));
    const ms: string = getInput('milliseconds');
    debug(`Waiting ${ms} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    debug(new Date().toTimeString());

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    setFailed(error.message);
  }
}

run();
