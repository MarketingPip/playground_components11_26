tf-8").decode(data);
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


async function synthesizeMsEdge(text = "Hi, how are you?", voice2) {
    let voice = voice2?.id;
  console.log(voice2)
    await tts.setMetadata(voice, OUTPUT_FORMAT.default);
    const readable = await tts.toStream(text);
    if (window.MediaSource && !navigator.userAgent.includes('Firefox')) return await streamToAudio(readable);
    console.log("no audio stream support, fallback");

    let chunks = await fetchStream(readable);
    return "data:audio/mp3;base64," + await chunks.arrayBuffer().then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))));
    //return URL.createObjectURL(chunks);

}
   await synthesizeMsEdge("hello",  {id:'af-ZA-WillemNeural'})
