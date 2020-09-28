import {Obfuscator} from './obfuscator';

test('Compile', async () => {
    //const input = parseInt('foo', 10)
    //await expect(wait(input)).rejects.toThrow('milliseconds not a number')
    let obs = new Obfuscator(
        `
FROM ubuntu
RUN echo "Hello World"; \
        echo "Hello Two"
        `
    )
    //console.log(obs.dumpEncrypted());
    //console.log(obs.dumpC());
    await obs.compile('/tmp/a');
})
