export  const SpechifyVoices = {
                "auto": null,
                "snoop": { speechify: true, "displayName": "Snoop Dogg", "engine": "resemble", "gender": "male", "Locale": "en-US", "localizedDisplayName": {}, "name": "snoop", "avatarImage": "https://storage.googleapis.com/centralized-voice-list/base/avatars/en-US-snoop-resemble.webp", "labels": ["beta"], "previewAudio": "https://storage.googleapis.com/centralized-voice-list/base/previews/en-US-snoop-resemble.mp3" },
                "mrbeast": { speechify: true, "displayName": "Barack Obama", "engine": "speechify", "gender": "male", "Locale": "en-US", "localizedDisplayName": {}, "name": "Presidential", "avatarImage": "https://storage.googleapis.com/centralized-voice-list/base/avatars/en-US-Presidential-speechify.webp", "labels": ["beta"], "previewAudio": "https://storage.googleapis.com/centralized-voice-list/base/previews/en-US-Presidential-speechify.mp3" },
                "GP": { speechify: true, "displayName": "Gwyneth Paltrow", "engine": "resemble", "gender": "female", "Locale": "en-US", "localizedDisplayName": {}, "name": "Gwyneth", "avatarImage": "https://storage.googleapis.com/centralized-voice-list/base/avatars/en-US-Gwyneth-resemble.webp", "labels": ["beta"], "previewAudio": "https://storage.googleapis.com/centralized-voice-list/base/previews/en-US-Gwyneth-resemble.mp3" },
                "narrator": { speechify: true, "displayName": "Narrator", "engine": "resemble", "gender": "male", "Locale": "en-GB", "localizedDisplayName": {}, "name": "narrator", "avatarImage": "https://storage.googleapis.com/centralized-voice-list/base/avatars/en-GB-narrator-resemble.webp", "labels": ["beta"], "previewAudio": "https://storage.googleapis.com/centralized-voice-list/base/previews/en-GB-narrator-resemble.mp3" },
                //voices 
            }

export async function synthesizeSpechify(text,voice ={  "name": "Snoop",
"engine": "resemble",
"languageCode": "en"}){
    const apiUrl = "https://audio.api.speechify.com/generateAudioFiles";
    const headers = {
        "accept": "*/*",
        "accept-base64": "true",
        "accept-language": "en,fi;q=0.9,ru;q=0.8,en-US;q=0.7",
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-speechify-client": "API"
    };
    const referrer = "https://onboarding.speechify.com/";
    const referrerPolicy = "strict-origin-when-cross-origin";
    const audioFormat = "mp3";
    const paragraphChunks = [text];
    const voiceParams = {
        "name": voice.name,
        "engine": voice.engine,
        "languageCode": voice.languageCode,
    };
    const requestBody = JSON.stringify({ audioFormat, paragraphChunks, voiceParams });
    const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        referrer,
        referrerPolicy,
        body: requestBody,
        mode: "cors",
        credentials: "omit"
    });
    const data = await response.json();
    return "data:audio/" + data.format + ";base64," + data.audioStream;
}
export default synthesizeSpechify;
