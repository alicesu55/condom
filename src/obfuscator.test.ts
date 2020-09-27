import {Obfuscator} from './obfuscator';

test('throws invalid number', async () => {
    //const input = parseInt('foo', 10)
    //await expect(wait(input)).rejects.toThrow('milliseconds not a number')
    let obs = new Obfuscator(
        `
FROM ubuntu
RUN echo "Hello World"
        `
    )
    console.log(obs.dumpEncrypted());
})
