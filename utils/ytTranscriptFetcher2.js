class YouTubeTranscriptFetcher {
  /**
   * Fetches the transcript for a given YouTube video ID
   * @param {string} videoId - The YouTube video ID
   * @returns {Promise<Array>} An array of transcript objects with text and timing
   */
  static async fetchTranscript(videoId) {
    try {
      // Fetch the video page to extract player response
      const response = await fetch(`https://corsproxy.io/?url=https://www.youtube.com/watch?v=${videoId}`);
      const pageText = await response.text();

      // Extract the player response using a regex pattern
      const playerResponseMatch = pageText.match(/ytInitialPlayerResponse\s*=\s*({.*?});/);
      
      if (!playerResponseMatch) {
        throw new Error('Could not find player response');
      }

      // Parse the player response
      const playerResponse = JSON.parse(playerResponseMatch[1]);
      
      // Check for closed captions/transcript availability
      const transcriptExists = playerResponse.captions && 
        playerResponse.captions.playerCaptionsTracklistRenderer;

      if (!transcriptExists) {
        throw new Error('No transcript available for this video');
      }

      // Extract transcript URL
      const transcriptUrl = this.extractTranscriptUrl(playerResponse);

      // Fetch the transcript XML
      const transcriptResponse = await fetch(transcriptUrl.startsWith('https://www.youtube.com') ? transcriptUrl : `https://www.youtube.com/${transcriptUrl}`);
      const transcriptXml = await transcriptResponse.text();

      // Parse the XML transcript
      return this.parseTranscriptXml(transcriptXml);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extracts the transcript URL from the player response
   * @param {Object} playerResponse - The YouTube player response object
   * @returns {string} Transcript URL
   */
  static extractTranscriptUrl(playerResponse) {
    const captionTracks = playerResponse.captions
      .playerCaptionsTracklistRenderer.captionTracks;

    // Prefer English transcript, fall back to first available
    const transcriptTrack = captionTracks.find(track => 
      track.languageCode === 'en') || captionTracks[0];

    // Decode the transcript URL
    return decodeURIComponent(transcriptTrack.baseUrl);
  }

  /**
   * Parses the XML transcript into an array of transcript objects
   * @param {string} xmlString - The transcript XML
   * @returns {Array} Parsed transcript array
   */
  static parseTranscriptXml(xmlString) {
    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Select all text elements
    const textElements = xmlDoc.querySelectorAll('text');
    
    // Map text elements to transcript objects
    return Array.from(textElements).map(el => ({
      text: this.decodeHtmlEntities(el.textContent),
      start: parseFloat(el.getAttribute('start')),
      duration: parseFloat(el.getAttribute('dur') || '0')
    }));
  }

  /**
   * Decodes HTML entities in the transcript text
   * @param {string} text - Text with potential HTML entities
   * @returns {string} Decoded text
   */
  static decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  /**
   * Searches the transcript for specific text
   * @param {Array} transcript - The full transcript array
   * @param {string} searchTerm - Text to search for
   * @returns {Array} Matching transcript segments
   */
  static searchTranscript(transcript, searchTerm) {
    return transcript.filter(segment => 
      segment.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

// Usage example
async function ytTranscriptFetcher(id) {
  try {
    const videoId = id; // Example video ID
    const transcript = await YouTubeTranscriptFetcher.fetchTranscript(videoId);
   
    
    return transcript.map(obj => obj.text).join(' ')
    
  } catch (error) {
   throw new TypeError(error)
  }
}
export default ytTranscriptFetcher
