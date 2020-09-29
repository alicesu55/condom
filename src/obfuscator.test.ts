import {Obfuscator} from './obfuscator';

test('Compile', async () => {

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
});

test('Escape charactors', async ()=>{
    let obs = new Obfuscator(
`
FROM alpine:edge

RUN gost_URL="$(wget -qO- https://api.github.com/repos/ginuerzh/gost/releases/latest | grep -E "browser_download_url.*linux-amd64" | cut -f4 -d\")"

ADD start.sh /start.sh
RUN chmod +x /start.sh

CMD /start.sh
`
    )
    obs.dumpEncrypted();
    console.log(obs.dumpC());
    await obs.compile('/tmp/a');
});
