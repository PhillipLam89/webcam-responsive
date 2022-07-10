let VIDEO = null  //all-caps elements mean they're GLOBAL
let CANVAS = null
let CONTEXT = null
let SCALER = 0.9 //how much of total width we want the video to cover?


const cameraShotSound = new Audio('./camera-sound.mp3')
const videoRecordingSound = new Audio('./camera-record.mp3')
const switchCameraButton = document.querySelector('#flip-camera')
const streamDeviceInfo = document.querySelector('#streamDeviceInfo > h6')
const SIZE =  {x:0,y:0,width:0, height:0}

let isCameraFacingUser = true
let CURRENT_SIGNAL = null //global needed to store previous signal since we must STOP all media tracks before switching betweem cameras
let animateFrames = null
let isVideoModeOn = true

const takePhotoButton = document.querySelector('.take-photo')
const savePhotoButton = document.querySelector('.save-photo')

function main() {
  CANVAS = document.querySelector('.myCanvas')
  CONTEXT = CANVAS.getContext('2d')

  let promise = navigator.mediaDevices.getUserMedia({video: true})
  promise.then(function(signal) {
     VIDEO = document.createElement('video')
     CURRENT_SIGNAL = signal
     const tracks = CURRENT_SIGNAL.getTracks()
    streamDeviceInfo.textContent = tracks[0].label


     VIDEO.srcObject = signal
     VIDEO.setAttribute('autoplay', '')  //these 3 lines are needed for iPhones to work
     VIDEO.setAttribute('muted', '') //these 3 lines are needed for iPhones to work
     VIDEO.setAttribute('playsinline', '') //these 3 lines are needed for iPhones to work
     VIDEO.play() // play method MUST be called for mobile to work, desktop isn't neccessary

     VIDEO.onloadeddata = function() {

         handleResize()
         window.addEventListener('resize', handleResize)
        updateCanvas()
     }
  }).catch(function(err) {
    alert('camera error dude: ' + err)
  })
}


switchCameraButton.addEventListener('click', function() {
  isCameraFacingUser = !isCameraFacingUser
  const tracks = CURRENT_SIGNAL.getTracks()
  tracks.forEach(track => track.stop()) //we must stop previous video tracks to start a new one (aka switch from front/back cam)
  promise = navigator.mediaDevices.getUserMedia({video: { facingMode: `${isCameraFacingUser ? 'user' : 'environment'}`}})
    promise.then(function(newSignal) {
      CURRENT_SIGNAL = newSignal
      VIDEO.srcObject = newSignal
      streamDeviceInfo.textContent = tracks[0].label
      VIDEO.play()
      VIDEO.onloadeddata = function() {
         handleResize()
         window.addEventListener('resize', handleResize)
        //  updateCanvas()  we do NOT need to call updateCanvas() since VIDEO is already calling it previously
     }
    })
})

function handleResize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight

      let resizerRatio = SCALER * Math.min(innerWidth/VIDEO.videoWidth, innerHeight/VIDEO.videoHeight)
    SIZE.width = resizerRatio * VIDEO.videoWidth //preserves aspect ratio
    SIZE.height = resizerRatio * VIDEO.videoHeight

    SIZE.x = innerWidth / 2 - SIZE.width / 2   //starts at middle of canvas and shifts half its width to left
    SIZE.y = innerHeight / 2 - SIZE.height / 2

      //starts at middle of canvas and shifts half its height to top
}

function updateCanvas() {
 CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height )
  animateFrames = window.requestAnimationFrame(updateCanvas) //will call this function recursively (60 FPS if possible)
                                      // which will allow live stream video updates
}

takePhotoButton.addEventListener('click', function() {
  isVideoModeOn = !isVideoModeOn

  if (!isVideoModeOn) {

    this.style.background = 'royalblue'
    this.textContent = 'Video'
    switchCameraButton.classList.add('hidden')
    cancelAnimationFrame(animateFrames)
    cameraShotSound.play()
  }
  else {
    this.style.background = 'forestgreen'
    this.textContent = 'Take Pic'
    switchCameraButton.classList.remove('hidden')
    videoRecordingSound.play()
    setTimeout(() => requestAnimationFrame(updateCanvas), 1500)
  }


})
savePhotoButton.addEventListener('click', function() {
    let data = CANVAS.toDataURL('image/png', 1) //1 will give best image quality
    let a = document.createElement("a")
    a.href = data

    a.download = "myScreenShot.png"
    a.click() //simulates an HTML element being clicked!
})
