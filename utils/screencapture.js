// screenCapture.js
async function startScreenCapture() {
  if (navigator.getDisplayMedia) {
    return navigator.getDisplayMedia({ video: true });
  } else if (navigator.mediaDevices.getDisplayMedia) {
    return navigator.mediaDevices.getDisplayMedia({ video: true });
  } else {
    return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
  }  
}

export class ScreenSharing {
  constructor() {
    this.stream = null;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.screenshot = false;
  }

  async startCapturing(downloadOnEnd=false, callback) {
    // Get the screen capture stream (video stream)
    this.stream = await startScreenCapture();
    // Create a video element to grab the screen frame
    const video = document.createElement('video');
    video.srcObject = this.stream;
    video.play();
  
    // Wait for the video to start playing
    return new Promise((resolve) => {
      video.onplaying = async () => {
        // Once the video starts playing, we can capture the current frame as a screenshot
         
        await this.captureImage(video, downloadOnEnd, callback);
         
         
        
        resolve();
      };
    });
  }
///
  async captureImage(video, downloadOnEnd, callback) {
    // Set the canvas size to the video dimensions
    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;
    this.context.imageSmoothingEnabled = false;
    // Draw the current video frame onto the canvas
    this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

    // Get the data URL (image in base64 format)
    const imageData = this.canvas.toDataURL('image/png');


      this.stopCapturing();
    this.screenshot = imageData
    
    if(callback){
      await callback(imageData)
    }
        // Optionally, you can download the image right away or save it
    if(downloadOnEnd){
    this.downloadImage(imageData);
    }  
  }

  getImageData(imageData) {
    if(!this.screenshot){
      throw new Error("No screenshot available")
  }
    
 }  
  
  downloadImage(imageData) {
    if(!this.screenshot){
      throw new Error("No screenshot available")
    }
    const downloadLink = document.createElement('a');
    downloadLink.href = imageData;
    downloadLink.download = 'screenshot.png';
    downloadLink.click();
  }

  stopCapturing() {
    // Stop the media stream (optional)
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.stream = null;
  }
   isScreenshotReady(){
    return this.screenshot
  }
}
export const screenSharing = new ScreenSharing();
