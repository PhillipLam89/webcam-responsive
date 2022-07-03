let VIDEO = null  //all-caps elements mean they're GLOBAL
let CANVAS = null
let CONTEXT = null
let SCALER = 0.9 //how much of total width we want the video to cover?

let SIZE =  {x:0,y:0,width:0, height:0}
let cameraUserFacing = true
const cameraFlipButton = document.querySelector('#flip-camera')
let promise = null
function main() {
  CANVAS = document.querySelector('#myCanvas')
  CONTEXT = CANVAS.getContext('2d')


  promise = navigator.mediaDevices.getUserMedia({video: true, facingMode: 'user'})
  promise.then(function(signal) {
     VIDEO = document.createElement('video')
     VIDEO.srcObject = signal
     VIDEO.setAttribute('autoplay', ''); //will start streaming from video cam, REQUIRED for iOS
     VIDEO.setAttribute('muted', ''); // REQUIRED for iOS
     VIDEO.setAttribute('playsinline', '') //REQUIRED for iOS

     VIDEO.onloadeddata = function() {
      handleResize()
         window.addEventListener('resize', handleResize)
          // we call handleResize here to to correctly modify our SIZE obj before rendering w/ updateCanvas()
    // const videoStream = navigator.mediaDevices.getUserMedia({video: true})
    // const videoTracks = videoStream.getTracks()
    // videoTracks.forEach(track => track.stop())


        updateCanvas()



     }
      cameraFlipButton.addEventListener('click', function () {
        cameraUserFacing = !cameraUserFacing
        const tracks = signal.getTracks()
        VIDEO.stop()
        tracks.forEach(track => track.stop())
        let newpromise = navigator.mediaDevices.getUserMedia({video: { facingMode: `${cameraUserFacing ? 'user' : 'environment'}`}})
        newpromise.then(function(newSignal) {
        VIDEO.srcObject = newSignal
        VIDEO.setAttribute('autoplay', ''); //will start streaming from video cam, REQUIRED for iOS
        VIDEO.setAttribute('muted', ''); // REQUIRED for iOS
        VIDEO.setAttribute('playsinline', '') //REQUIRED for iOS

        VIDEO.play()
         VIDEO.onloadeddata = function() {

         handleResize() // we call handleResize here to to correctly modify our SIZE obj before rendering w/ updateCanvas()
    // const videoStream = navigator.mediaDevices.getUserMedia({video: true})
    // const videoTracks = videoStream.getTracks()
    // videoTracks.forEach(track => track.stop())

            window.addEventListener('resize', handleResize)
        updateCanvas()
     }

      } )
})

  }).catch(function(err) {
    alert('camera error dude' + err)
  })
}


function handleResize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight

      let resizerRatio = SCALER * Math.min(innerWidth / VIDEO.videoWidth, innerHeight / VIDEO.videoHeight)
    SIZE.width = resizerRatio * VIDEO.videoWidth //preserves aspect ratio
    SIZE.height = resizerRatio * VIDEO.videoHeight

    SIZE.x = innerWidth / 2 - SIZE.width / 2   //starts at middle of canvas and shifts half its width to left
    SIZE.y = innerHeight / 2 - SIZE.height / 2

      //starts at middle of canvas and shifts half its height to top
}

function updateCanvas() {
    CANVAS.style.background = `royalblue`
  CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height )



  requestAnimationFrame(updateCanvas) //will calls this function recursively (60 FPS if possible)
                                      // which will allow live stream video updates
}



// cameraFlipButton.addEventListener('click', function() {
//   cameraUserFacing = !cameraUserFacing

//     const videoStream = navigator.mediaDevices.getUserMedia({video: true})
//     const videoTracks = videoStream.getTracks()
//     videoTracks.forEach(track => track.stop())

// })
