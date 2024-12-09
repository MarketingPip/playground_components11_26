  export function MsEdgeTTS(){
  const OUTPUT_FORMAT = {
    RAW_16KHZ_16BIT_MONO_PCM: "raw-16khz-16bit-mono-pcm",
    RAW_24KHZ_16BIT_MONO_PCM: "raw-24khz-16bit-mono-pcm",
    // ... (other enum values)
    OGG_48KHZ_16BIT_MONO_OPUS: "ogg-48khz-16bit-mono-opus",
    default: "audio-24khz-48kbitrate-mono-mp3",
};


async function getVoices() {
    try {
        const response = await fetch(`https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`);
        const json = await response.json();
        const results = []
        for (let voice of json) {
            if (voice.ShortName.startsWith("en-TZ") || voice.ShortName.startsWith("en-NZ")) continue;

            voice.id = voice.ShortName;
            voice.ms = true;
            voice.name = voice.ShortName; // .replace(/.*-(\w+)Neural$/, '$1'); 
            results.push({name:voice.FriendlyName.replace("Online (Natural) ", "").replace("Microsoft", "").trim(), value:voice.id })
        }
      return results
    } catch (error) {
        console.error("Error fetching or processing voices:", error);
    }
}
 


class MsEdgeTTS {
    static SYNTH_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`;
    static OUTPUT_FORMAT = OUTPUT_FORMAT;
    static VOICE_LANG_REGEX = /\w{2}-\w{2}/;

    constructor(enableLogger = true) {
        this._enableLogger = enableLogger;
        this._queue = {};

    }

    async _send(message) {
        if (this._connection?.readyState !== WebSocket.OPEN) {
            await this._initClient();
        }
        this._connection.send(message);
    }

    _connect() {
        if (this._enableLogger) this._startTime = Date.now();
        this._ws = new WebSocket(MsEdgeTTS.SYNTH_URL);
        return new Promise((resolve) => (this._ws.onopen = resolve));
    }

    async _initClient() {
        this._connection = (await this._connect()).target;


        if (this._enableLogger) console.log("Connected in", (Date.now() - this._startTime) / 1000, "seconds");
        let requestId;
        this._connection.onclose = () => {
            if (this._enableLogger) console.log("disconnected");
            try {
                const controller = this._queue[requestId];
                controller.close();
            } catch (e) { }
        };

        this._connection.onmessage = (event) => {
            const data = typeof event.data === 'string' ? event.data : new Uint8Array(event.data);

            // Handle text messages
            if (typeof data === 'string') {
                requestId = /X-RequestId:(.*?)\r\n/gm.exec(data)[1];
                // Your existing code for handling text messages...
                if (data.includes("Path:turn.start")) {
                    // start of turn, ignore
                } else if (data.includes("Path:turn.end")) {
                    // end of turn, close stream
                    //this._queue[requestId].enqueue(null);
                    //this._queue[requestId].close();
                } else if (data.includes("Path:response")) {
                    // context response, ignore
                } else {
                    console.log("UNKNOWN MESSAGE", data);
                }
            }
            // Handle binary messages
            else if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    const data = new Uint8Array(reader.result);
                    const requestId = /X-RequestId:(.*?)\r\n/gm.exec(new TextDecoder().decode(data))[1];
                    const controller = this._queue[requestId];
                    if (data[0] === 0x00 && data[1] === 0x67 && data[2] === 0x58) {
                        // Last (empty) audio fragment
                        controller.close();
                    } else {
                        let BINARY_DELIM = "Path:audio\r\n";
                        const dataAsString = new TextDecoder("utf-8").decode(data);
                        const index = dataAsString.indexOf(BINARY_DELIM) + BINARY_DELIM.length;
                        const audioData = data.slice(index);
                     
                        controller.enqueue(audioData);
                    }
                };
                reader.readAsArrayBuffer(event.data);
            }
        };

        await this._send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
                    {
                        "context": {
                            "synthesis": {
                                "audio": {
                                    "metadataoptions": {
                                        "sentenceBoundaryEnabled": "false",
                                        "wordBoundaryEnabled": "false"
                                    },
                                    "outputFormat": "${this._outputFormat}"
                                }
                            }
                        }
                    }
                `);


        this._ws.onerror = function (error) {
            throw new Error("Connect Error: " + error);
        };

    }

    async setMetadata(voiceName, outputFormat, voiceLocale) {
        const oldVoice = this._voice;
        const oldVoiceLocale = this._voiceLocale;
        const oldOutputFormat = this._outputFormat;

        this._voice = voiceName;
        this._voiceLocale = voiceLocale;
        if (!this._voiceLocale) {
            const voiceLangMatch = MsEdgeTTS.VOICE_LANG_REGEX.exec(this._voice);
            if (!voiceLangMatch) throw new Error("Could not infer voiceLocale from voiceName!");
            this._voiceLocale = voiceLangMatch[0];
        }
        this._outputFormat = outputFormat;

        const changed = oldVoice !== this._voice || oldVoiceLocale !== this._voiceLocale || oldOutputFormat !== this._outputFormat;

        // create new client
        if (!this._ws || changed) {
            //await this._initClient();
        }
    }



    async toStream(input) {
        return this._rawSSMLRequest(this._SSMLTemplate(input));
    }

    async rawToStream(requestSSML) {
        return this._rawSSMLRequest(requestSSML);
    }

    _SSMLTemplate(input) {
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${this._voiceLocale}">
                <voice name="${this._voice}" >
                    ${input.replace(/<[^>]*>/g, "")}
                </voice>
            </speak>`;
    }

    async _rawSSMLRequest(requestSSML) {

        const requestId = this._generateRequestId();
        const request = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n
                    ${requestSSML.trim()}`;
        let controller;

        const readable = new ReadableStream({
            start(c) {
                controller = c;
            },
            cancel() {
                //controller.close();
            }
        });
        this._queue[requestId] = controller;
        await this._send(request);
        return readable;
    }
    _generateRequestId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
}


// Example usage
const tts = new MsEdgeTTS();

async function fetchStream(readableStream) {
    const reader = readableStream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    return new Blob(chunks, { type: "audio/mpeg" });
}

async function streamToAudio(readableStream) {

    // Create a MediaSource object
    const mediaSource = new MediaSource();
    let url = URL.createObjectURL(mediaSource);;
    // Wait for the MediaSource to be ready    

    mediaSource.addEventListener('sourceopen', () => {

        // Create a source buffer
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'); // Change the mime type to match your media format

        // Function to append chunks to the source buffer
        async function appendStreamData(chunk) {
            return new Promise((resolve, reject) => {
                sourceBuffer.addEventListener('updateend', () => {
                    resolve();
                }, { once: true });
                sourceBuffer.addEventListener('error', (e) => {
                    reject(e);
                }, { once: true });
                sourceBuffer.appendBuffer(chunk);
            });
        }

        // Function to read data from the ReadableStream and append it to the source buffer
        async function processStream(stream) {
            const reader = stream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                await appendStreamData(value);
            }

            // Signal the end of the media source
            mediaSource.endOfStream();
        }

        // Start streaming the data to the audio element

        processStream(readableStream);


    }, { once: true });



    return url;
}


async function synthesizeMsEdge(text = null, voice2) {
    let voice = voice2?.id;
 
    await tts.setMetadata(voice, OUTPUT_FORMAT.default);
    const readable = await tts.toStream(text);
    if (window.MediaSource && !navigator.userAgent.includes('Firefox')) return await streamToAudio(readable);
    console.log("no aussdio stream support, fallback");

    let chunks = await fetchStream(readable);
    return "data:audio/mp3;base64," + await chunks.arrayBuffer().then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))));
    //return URL.createObjectURL(chunks);

}
    
    
    
   return {
     getVoices,
     TTS: synthesizeMsEdge
   }
    
  }
